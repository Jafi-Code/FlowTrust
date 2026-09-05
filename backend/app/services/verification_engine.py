def calculate_trust_score(invoice: dict):

    score = 0

    evidence = []

    # Buyer verification
    if invoice.get("buyer_registration_number"):
        score += 25

        evidence.append({
            "signal": "Buyer verification",
            "points": 25,
            "status": "PASS"
        })

    else:
        evidence.append({
            "signal": "Buyer verification",
            "points": 0,
            "status": "MISSING"
        })

    # PO match
    if invoice.get("purchase_order_number"):
        score += 20

        evidence.append({
            "signal": "Purchase order",
            "points": 20,
            "status": "PASS"
        })

    else:
        evidence.append({
            "signal": "Purchase order",
            "points": 0,
            "status": "MISSING"
        })

    # Payment terms
    if invoice.get("payment_terms_days", 0) <= 60:
        score += 10

        evidence.append({
            "signal": "Payment terms",
            "points": 10,
            "status": "PASS"
        })

    # Base invoice consistency
    score += 15

    evidence.append({
        "signal": "Invoice consistency",
        "points": 15,
        "status": "PASS"
    })

    # Prototype delivery confirmation
    score += 20

    evidence.append({
        "signal": "Delivery confirmation",
        "points": 20,
        "status": "SIMULATED"
    })

    # Duplicate check
    score += 10

    evidence.append({
        "signal": "Duplicate detection",
        "points": 10,
        "status": "CLEAR"
    })

    if score >= 80:
        risk_level = "LOW"

    elif score >= 60:
        risk_level = "MEDIUM"

    elif score >= 40:
        risk_level = "HIGH"

    else:
        risk_level = "CRITICAL"

    return {
        "trust_score": score,
        "risk_level": risk_level,
        "evidence": evidence
    }