import os
from pathlib import Path
from urllib.parse import quote_plus

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MONGODB_USERNAME = os.getenv("MONGODB_USERNAME")
MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD")
MONGODB_CLUSTER = os.getenv("MONGODB_CLUSTER")

if not MONGODB_USERNAME:
    raise ValueError("MONGODB_USERNAME is not configured")

if not MONGODB_PASSWORD:
    raise ValueError("MONGODB_PASSWORD is not configured")

if not MONGODB_CLUSTER:
    raise ValueError("MONGODB_CLUSTER is not configured")

username = quote_plus(MONGODB_USERNAME)
password = quote_plus(MONGODB_PASSWORD)

MONGODB_URL = (
    f"mongodb+srv://{username}:{password}@{MONGODB_CLUSTER}/"
    "?appName=Cluster0"
)

client = MongoClient(MONGODB_URL)

db = client["flowtrust"]

users_collection = db["users"]
invoices_collection = db["invoices"]
trust_profiles_collection = db["trust_profiles"]
risk_flags_collection = db["risk_flags"]
audit_logs_collection = db["audit_logs"]
funding_offers_collection = db["funding_offers"]