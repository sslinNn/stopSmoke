import markdown
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from src.database import get_db
from src.models.posts import Posts
from src.schemas.post_schema import SPosts
from src.utils.jwt_utils import get_id_from_access_token

router = APIRouter()

@router.get("/")
async def get_all_posts(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(Posts)
        result = await db.execute(stmt)
        return {"success": True, "data": result.scalars().all()}
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

        new_post = Posts(title=data.title, content=data.content, author=user_id, category=data.category)
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return {"success": True, "data": new_post}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))