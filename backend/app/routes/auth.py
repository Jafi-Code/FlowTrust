from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, HTTPException

from app.config import settings


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def create_access_token(user_id: str, role: str):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "role": role,
        "exp": expires
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )


@router.get("/test")
def auth_test():
    return {
        "message": "Authentication router is working"
    }