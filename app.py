import streamlit as st
import pytesseract
from PIL import Image
import re
import json
from pathlib import Path

# -------------------------------------------------
# TESSERACT OCR LOCATION
# -------------------------------------------------

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# -------------------------------------------------
# PAGE CONFIGURATION
# -------------------------------------------------

st.set_page_config(
    page_title="FlowTrust Document Intelligence",
    page_icon="📄",
    layout="wide"
)

# -------------------------------------------------
# HEADER
# -------------------------------------------------

st.title("FlowTrust")
st.subheader("Document Intelligence & AI Extraction")

st.write(
    "Upload an invoice, purchase order, proof of delivery, "
    "or buyer record. FlowTrust will extract important information "
    "using OCR."
)

st.divider()

# -------------------------------------------------
# DOCUMENT UPLOAD
# -------------------------------------------------

uploaded_file = st.file_uploader(
    "Upload your document",
    type=["png", "jpg", "jpeg"]
)

# -------------------------------------------------
# DOCUMENT TYPE
# -------------------------------------------------

document_type = st.selectbox(
    "Document Type",
    [
        "Invoice",
        "Purchase Order",
        "Proof of Delivery",
        "Buyer Record"
    ]
)

# -------------------------------------------------
# PROCESS DOCUMENT
# -------------------------------------------------

if uploaded_file is not None:

    st.success(f"Document uploaded: {uploaded_file.name}")

    image = Image.open(uploaded_file)

    st.image(
        image,
        caption="Uploaded Document",
        width=500
    )

    if st.button("🔍 Extract Information"):

        with st.spinner("AI is reading the document..."):

            # OCR
            extracted_text = pytesseract.image_to_string(image)

        st.divider()

        # -------------------------------------------------
        # RAW OCR TEXT
        # -------------------------------------------------

        st.subheader("1. OCR Result")

        st.text_area(
            "Extracted Text",
            extracted_text,
            height=250
        )

        # -------------------------------------------------
        # SIMPLE AI-STYLE FIELD EXTRACTION
        # -------------------------------------------------

        def find_value(pattern, text):

            match = re.search(
                pattern,
                text,
                re.IGNORECASE
            )

            if match:
                return match.group(1).strip()

            return "Not detected"

        invoice_number = find_value(
            r"(?:invoice\s*(?:number|no|#)?\s*[:\-]?\s*)([A-Z0-9\-\/]+)",
            extracted_text
        )

        po_number = find_value(
            r"(?:PO\s*(?:number|no|#)?\s*[:\-]?\s*)([A-Z0-9\-\/]+)",
            extracted_text
        )

        date = find_value(
            r"(?:date\s*[:\-]?\s*)([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",
            extracted_text
        )

        total = find_value(
            r"(?:total\s*[:\-]?\s*R?\s*)([0-9,]+(?:\.[0-9]{1,2})?)",
            extracted_text
        )

        vat = find_value(
            r"(?:VAT\s*[:\-]?\s*R?\s*)([0-9,]+(?:\.[0-9]{1,2})?)",
            extracted_text
        )

        # -------------------------------------------------
        # EXTRACTED INFORMATION
        # -------------------------------------------------

        st.subheader("2. Extracted Information")

        col1, col2 = st.columns(2)

        with col1:

            st.metric(
                "Document Type",
                document_type
            )

            st.write("**Invoice Number:**")
            st.info(invoice_number)

            st.write("**Purchase Order:**")
            st.info(po_number)

            st.write("**Date:**")
            st.info(date)

        with col2:

            st.write("**Total Amount:**")
            st.info(f"R {total}")

            st.write("**VAT:**")
            st.info(f"R {vat}")

            st.write("**OCR Status:**")
            st.success("Successfully processed")

        # -------------------------------------------------
        # STRUCTURED DATA
        # -------------------------------------------------

        structured_data = {
            "document_type": document_type,
            "invoice_number": invoice_number,
            "purchase_order": po_number,
            "date": date,
            "total": total,
            "vat": vat
        }

        st.divider()

        st.subheader("3. Structured Data")

        st.json(structured_data)

        # -------------------------------------------------
        # CONFIDENCE
        # -------------------------------------------------

        fields_detected = sum(
            value != "Not detected"
            for value in structured_data.values()
        )

        confidence = int(
            (fields_detected / len(structured_data)) * 100
        )

        st.subheader("4. Extraction Confidence")

        st.progress(confidence / 100)

        st.write(
            f"**Confidence Score: {confidence}%**"
        )

        if confidence >= 80:
            st.success("HIGH CONFIDENCE")
        elif confidence >= 50:
            st.warning("MEDIUM CONFIDENCE")
        else:
            st.error("LOW CONFIDENCE")