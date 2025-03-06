from dependency_injector import containers, providers
from sqlalchemy.ext.asyncio import AsyncSession

from services.user_service import UserService

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=["routers.users_router", "routers.auth_router"]
    )
    
    db = providers.Dependency(AsyncSession)
    user_service = providers.Factory(
        UserService,
        db=db
    ) 