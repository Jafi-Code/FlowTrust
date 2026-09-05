from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth
from app.routes import invoice
from app.routes import verification


app = FastAPI(
    title="FlowTrust API",
    description="Receivable verification and intelligence platform for SME invoice financing.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(invoice.router)
app.include_router(verification.router)


@app.get("/")
def root():
    return {
        "name": "FlowTrust API",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }