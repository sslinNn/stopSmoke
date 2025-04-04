from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete, join, update
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST

from src.database import get_db
from src.models.posts import PostComments, Posts
from src.models.users import User
from src.schemas.comment_schema import SCommentCreate, SCommentResponse
from src.utils.jwt_utils import get_id_from_access_token

router = APIRouter()


@router.post("/", response_model=SCommentResponse)
async def create_comment(
    request: Request,
    comment_data: SCommentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Создание нового комментария к посту"""
    # Получаем ID пользователя из токена
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен отсутствует")
    
    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен недействителен")
    
    # Проверяем существование поста
    stmt = select(Posts).where(Posts.id == comment_data.post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND, 
            detail=f"Пост с ID {comment_data.post_id} не найден"
        )
    
    # Создаем новый комментарий
    new_comment = PostComments(
        post_id=comment_data.post_id,
        user_id=user_id,
        content=comment_data.content
    )
    
    db.add(new_comment)
    
    # Увеличиваем счетчик комментариев в посте
    stmt = update(Posts).where(Posts.id == comment_data.post_id).values(comments=Posts.comments + 1)
    await db.execute(stmt)
    
    await db.commit()
    await db.refresh(new_comment)
    
    # Получаем данные о пользователе
    stmt = select(User.username, User.avatar_url).where(User.id == user_id)
    result = await db.execute(stmt)
    user_data = result.first()
    
    # Формируем ответ
    response_data = SCommentResponse(
        id=new_comment.id,
        post_id=new_comment.post_id,
        user_id=new_comment.user_id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        username=user_data.username if user_data else None,
        avatar_url=user_data.avatar_url if user_data else None
    )
    
    return response_data


@router.get("/post/{post_id}")
async def get_post_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    """Получение всех комментариев к посту"""
    # Проверяем существование поста
    stmt = select(Posts).where(Posts.id == post_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND, 
            detail=f"Пост с ID {post_id} не найден"
        )
    
    # Получаем комментарии с информацией о пользователях
    stmt = select(
        PostComments.id,
        PostComments.post_id,
        PostComments.user_id,
        PostComments.content,
        PostComments.created_at,
        User.username,
        User.avatar_url
    ).join(
        User, PostComments.user_id == User.id
    ).where(
        PostComments.post_id == post_id
    ).order_by(PostComments.created_at)
    
    result = await db.execute(stmt)
    comments = [dict(row) for row in result.mappings().all()]
    
    return {"success": True, "data": comments}


@router.delete("/{comment_id}")
async def delete_comment(comment_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    """Удаление комментария"""
    # Получаем ID пользователя из токена
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен отсутствует")
    
    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен недействителен")
    
    # Получаем комментарий
    stmt = select(PostComments).where(PostComments.id == comment_id)
    result = await db.execute(stmt)
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND, 
            detail=f"Комментарий с ID {comment_id} не найден"
        )
    
    # Проверяем права на удаление (только автор может удалить свой комментарий)
    if comment.user_id != user_id:
        # Проверяем, является ли пользователь автором поста
        stmt = select(Posts).where(Posts.id == comment.post_id)
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()
        
        if post and post.author != user_id:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN, 
                detail="У вас нет прав на удаление этого комментария"
            )
    
    # Запоминаем post_id перед удалением комментария
    post_id = comment.post_id
    
    # Удаляем комментарий
    await db.delete(comment)
    
    # Уменьшаем счетчик комментариев в посте
    stmt = update(Posts).where(Posts.id == post_id).values(comments=Posts.comments - 1)
    await db.execute(stmt)
    
    await db.commit()
    
    return {"success": True, "message": "Комментарий успешно удален"}


@router.put("/{comment_id}")
async def update_comment(
    comment_id: int, 
    content: str, 
    request: Request, 
    db: AsyncSession = Depends(get_db)
):
    """Обновление комментария"""
    # Получаем ID пользователя из токена
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен отсутствует")
    
    user_id = await get_id_from_access_token(token)
    if not user_id:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Токен недействителен")
    
    # Получаем комментарий
    stmt = select(PostComments).where(PostComments.id == comment_id)
    result = await db.execute(stmt)
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND, 
            detail=f"Комментарий с ID {comment_id} не найден"
        )
    
    # Проверяем права на редактирование (только автор может редактировать свой комментарий)
    if comment.user_id != user_id:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, 
            detail="У вас нет прав на редактирование этого комментария"
        )
    
    # Проверяем, что контент не пустой
    if not content or not content.strip():
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Содержание комментария не может быть пустым"
        )
    
    # Обновляем комментарий
    stmt = update(PostComments).where(PostComments.id == comment_id).values(content=content)
    await db.execute(stmt)
    await db.commit()
    
    # Получаем обновленный комментарий
    stmt = select(
        PostComments.id,
        PostComments.post_id,
        PostComments.user_id,
        PostComments.content,
        PostComments.created_at,
        User.username,
        User.avatar_url
    ).join(
        User, PostComments.user_id == User.id
    ).where(
        PostComments.id == comment_id
    )
    
    result = await db.execute(stmt)
    updated_comment = result.mappings().one_or_none()
    
    return {"success": True, "data": dict(updated_comment)}


@router.get("/count")
async def get_comments_count(post_ids: list[int] = None, db: AsyncSession = Depends(get_db)):
    """Получение количества комментариев для постов"""
    if not post_ids:
        return {"success": True, "data": {}}
    
    result = {}
    for post_id in post_ids:
        # Для каждого поста получаем количество комментариев
        stmt = select(Posts.comments).where(Posts.id == post_id)
        response = await db.execute(stmt)
        comments_count = response.scalar_one_or_none()
        
        if comments_count is not None:
            result[str(post_id)] = comments_count
    
    return {"success": True, "data": result} 