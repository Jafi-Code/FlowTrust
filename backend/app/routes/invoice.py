from fastapi import APIRouter, HTTPException

from app.database import invoices_collection
from app.schemas.invoice import InvoiceCreate

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"]
)


@router.post("/")
def create_invoice(invoice: InvoiceCreate):

    invoice_document = {
        **invoice.model_dump(),
        "status": "SUBMITTED",
        "verification_status": "PENDING"
    }

    result = invoices_collection.insert_one(
        invoice_document
    )

    return {
        "message": "Invoice submitted successfully",
        "invoice_id": str(result.inserted_id),
        "status": "SUBMITTED"
    }


@router.get("/")
def get_invoices():

    invoices = []

    for invoice in invoices_collection.find():

        invoice["id"] = str(invoice["_id"])
        del invoice["_id"]

        invoices.append(invoice)

    return invoices