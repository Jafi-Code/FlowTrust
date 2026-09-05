import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "FlowTrust API"
    VERSION = "1.0.0"

    MONGODB_URL = os.getenv("MONGODB_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "flowtrust")

    JWT_SECRET = os.getenv("JWT_SECRET")

    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

settings = Settings()