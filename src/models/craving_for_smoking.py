from sqlalchemy import Column, Integer, ForeignKey, Boolean, String, DateTime
from sqlalchemy.orm import relationship

from src.database import Base


class CravingForSmoking(Base):
    __tablename__ = "craving_for_smoking"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason_id = Column(Integer, ForeignKey("reasons.id"), nullable=False)
    is_smoking = Column(Boolean, nullable=False, default=False)
    intensity = Column(Integer, nullable=False, default=0)  # Можно ограничить диапазон (0–10)
    date = Column(DateTime(timezone=True), nullable=False)

    # Определяем связи
    user = relationship("User", back_populates="cravings")
    reason = relationship("Reason", back_populates="cravings")


class Reason(Base):
    __tablename__ = "reasons"

    id = Column(Integer, primary_key=True, autoincrement=True)
    reason = Column(String, nullable=False, unique=True)

    # Связь: одна причина может быть у нескольких записей о тяге
    cravings = relationship("CravingForSmoking", back_populates="reason")

