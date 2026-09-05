from pydantic import BaseModel, EmailStr
from typing import Literal


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["SME", "FUNDER", "ADMIN"] = "SME"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str