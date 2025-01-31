from pydantic import BaseModel


class CoreSchema(BaseModel):
    """
    Any common logic to be shared between all models.
    """
    pass

class IDSchemaMixin(BaseModel):
    id: int