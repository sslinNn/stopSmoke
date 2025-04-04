import markdown
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update, label, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from src.models.posts import PostLikes
from src.database import get_db
from src.models.posts import Posts
from src.models.users import User
from src.schemas.post_schema import SPosts
from src.utils.jwt_utils import get_id_from_access_token

router = APIRouter()


async def add_like(post_id: int, user_id: int, db: AsyncSession):
    stmt = select(PostLikes).where(PostLikes.post_id == post_id, PostLikes.user_id == user_id)
    result = await db.execute(stmt)
    exists = result.scalar_one_or_none()
    if exists:
        return

    new_like = PostLikes(post_id=post_id, user_id=user_id)
    db.add(new_like)

    # Обновляем счетчик лайков
    await db.execute(update(Posts).where(Posts.id == post_id).values(likes=Posts.likes + 1))

    await db.commit()


# ✅ Функция удаления лайка
async def remove_like(post_id: int, user_id: int, db: AsyncSession):
    stmt = select(PostLikes).where(PostLikes.post_id == post_id, PostLikes.user_id == user_id)
    result = await db.execute(stmt)
    like = result.scalar_one_or_none()
    if not like:
        return

    await db.delete(like)
    await db.flush()  # Обновляем данные в БД перед изменением likes

    # Уменьшаем количество лайков
    await db.execute(update(Posts).where(Posts.id == post_id).values(likes=Posts.likes - 1))

    await db.commit()


@router.get("/")
async def get_all_posts(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(
            Posts.id,
            Posts.content,
            Posts.category,
            Posts.likes,
            Posts.comments,
            Posts.title,
            label("author", User.username),
            Posts.created_at
        ).join(User, User.id == Posts.author)
        result = await db.execute(stmt)
        posts = [dict(row) for row in result.mappings().all()]  # Преобразование в список словарей

        return {"success": True, "data": posts}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def convert_markdown_to_html(content: str) -> str:
    return markdown.markdown(content)

@router.get("/{post_id}")
async def get_post(post_id:int, db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(
            Posts.id,
            Posts.content,
            Posts.category,
            Posts.likes,
            Posts.comments,
            Posts.title,
            Posts.author,
            Posts.created_at,
            User.username,
            User.avatar_url,
        ).join(User, User.id == Posts.author).where(Posts.id == post_id)
        result = await db.execute(stmt)
        posts = [dict(row) for row in result.mappings().all()]  # Преобразование в список словарей

        return {"success": True, "data": posts}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def convert_markdown_to_html(content: str) -> str:
    return markdown.markdown(content)

@router.post("/")
async def add_post(request: Request, data: SPosts, db: AsyncSession = Depends(get_db)):
    try:
        token = request.cookies.get("access_token")
        if not token:
            print('not token')
            raise HTTPException(status_code=401, detail="Token is missing")
        user_id = await get_id_from_access_token(token)
        if not user_id:
            print('not user id')
            raise HTTPException(status_code=401, detail="Token is invalid")

        new_post = Posts(
            title=data.title,
            content=data.content,
            author=user_id,
            category=data.category
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return {"success": True, "data": new_post}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



# ✅ Функция добавления лайка
async def add_like(post_id: int, user_id: int, db: AsyncSession):
    # Проверяем существование поста
    stmt = select(Posts).where(Posts.id == post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Проверяем, не лайкнул ли уже пользователь этот пост
    stmt = select(PostLikes).where(PostLikes.post_id == post_id, PostLikes.user_id == user_id)
    result = await db.execute(stmt)
    existing_like = result.scalar_one_or_none()
    if existing_like:
        raise HTTPException(status_code=400, detail="Post already liked")

    # Добавляем лайк
    new_like = PostLikes(post_id=post_id, user_id=user_id)
    db.add(new_like)

    # Обновляем счетчик лайков
    stmt = update(Posts).where(Posts.id == post_id).values(likes=Posts.likes + 1)
    await db.execute(stmt)
    await db.commit()

# ✅ Функция удаления лайка
async def remove_like(post_id: int, user_id: int, db: AsyncSession):
    # Проверяем существование поста
    stmt = select(Posts).where(Posts.id == post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Проверяем, существует ли лайк
    stmt = select(PostLikes).where(PostLikes.post_id == post_id, PostLikes.user_id == user_id)
    result = await db.execute(stmt)
    existing_like = result.scalar_one_or_none()
    if not existing_like:
        raise HTTPException(status_code=400, detail="Post not liked")

    # Удаляем лайк
    stmt = delete(PostLikes).where(PostLikes.post_id == post_id, PostLikes.user_id == user_id)
    await db.execute(stmt)

    # Обновляем счетчик лайков, используя подзапрос для подсчета актуального количества лайков
    likes_count = select(func.count()).select_from(PostLikes).where(PostLikes.post_id == post_id).scalar_subquery()
    stmt = update(Posts).where(Posts.id == post_id).values(likes=likes_count)
    await db.execute(stmt)
    await db.commit()

# ✅ Эндпоинт: получить список лайкнутых постов
@router.get('/user/liked')
async def get_liked_posts(request: Request, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is invalid")

    # Получаем список ID постов, которые лайкнул пользователь
    stmt = select(PostLikes.post_id).where(PostLikes.user_id == user_id)
    result = await db.execute(stmt)
    liked_posts = [row[0] for row in result.fetchall()]

    return {"likedPosts": liked_posts}

# ✅ Эндпоинт: поставить лайк
@router.post('/{post_id}/like')
async def like_post(request: Request, post_id: int, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is invalid")

    await add_like(post_id, user_id, db)

    # Получаем актуальное количество лайков
    stmt = select(func.count()).select_from(PostLikes).where(PostLikes.post_id == post_id)
    result = await db.execute(stmt)
    likes = result.scalar_one_or_none() or 0

    return {"post_id": post_id, "likes": likes, "liked_by_user": True}

# ✅ Эндпоинт: убрать лайк
@router.delete('/{post_id}/like')
async def unlike_post(request: Request, post_id: int, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token is invalid")

    await remove_like(post_id, user_id, db)

    # Получаем актуальное количество лайков
    stmt = select(func.count()).select_from(PostLikes).where(PostLikes.post_id == post_id)
    result = await db.execute(stmt)
    likes = result.scalar_one_or_none() or 0

    return {"post_id": post_id, "likes": likes, "liked_by_user": False}