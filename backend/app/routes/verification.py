from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.database import (
    invoices_collection,
    trust_profiles_collection
)

from app.services.verification_engine import (
    calculate_trust_score
)

router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


@router.post("/{invoice_id}")
def verify_invoice(invoice_id: str):

    try:
        object_id = ObjectId(invoice_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid invoice ID"
        )

    invoice = invoices_collection.find_one({
        "_id": object_id
    })

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    result = calculate_trust_score(invoice)

    trust_profile = {
        "invoice_id": invoice_id,

        "trust_score": result["trust_score"],

        "risk_level": result["risk_level"],

        "status": (
            "FINANCE_READY"
            if result["trust_score"] >= 80
            else "REVIEW_REQUIRED"
        ),

        "evidence": result["evidence"]
    }

    inserted = trust_profiles_collection.insert_one(
        trust_profile
    )

    invoices_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "verification_status": "COMPLETED",
                "trust_profile_id": str(inserted.inserted_id)
            }
        }
    )

    return {
        "message": "Verification completed",
        "invoice_id": invoice_id,
        **trust_profile,
        "trust_profile_id": str(inserted.inserted_id)
    }