import os
from pathlib import Path

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not configured")

client = MongoClient(MONGODB_URL)

db = client["flowtrust"]

users_collection = db["users"]
invoices_collection = db["invoices"]
trust_profiles_collection = db["trust_profiles"]
risk_flags_collection = db["risk_flags"]
audit_logs_collection = db["audit_logs"]
funding_offers_collection = db["funding_offers"]