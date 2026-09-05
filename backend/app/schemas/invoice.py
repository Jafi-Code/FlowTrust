from pydantic import BaseModel
from typing import Optional


class InvoiceCreate(BaseModel):

    invoice_number: str
    invoice_date: str
    due_date: str

    amount: float
    currency: str = "ZAR"

    buyer_name: str
    buyer_registration_number: Optional[str] = None

    purchase_order_number: Optional[str] = None

    payment_terms_days: Optional[int] = 30


class InvoiceResponse(BaseModel):

    id: str
    invoice_number: str
    amount: float
    currency: str

    buyer_name: str

    status: str