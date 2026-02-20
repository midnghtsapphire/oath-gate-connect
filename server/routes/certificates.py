"""Certificate generation with QR codes and database persistence."""
from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
import qrcode
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from datetime import datetime
import os
from server.database import get_db
from server.models import User, Certificate
from server.routes.auth import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

# Certificate storage directory
CERT_DIR = "/tmp/certificates"
os.makedirs(CERT_DIR, exist_ok=True)

class OrdinationCertificateRequest(BaseModel):
    minister_name: str
    denomination: str = "Universal Life Church"
    specializations: List[str] = []

class MarriageCertificateRequest(BaseModel):
    partner1_name: str
    partner2_name: str
    officiant_name: str
    ceremony_date: str
    ceremony_location: str

class CertificateResponse(BaseModel):
    certificate_id: str
    verification_url: str
    qr_code_data: str
    pdf_url: str

@router.post("/ordination/generate", response_model=CertificateResponse)
async def generate_ordination_certificate(
    request: OrdinationCertificateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate an ordination certificate with QR code verification"""
    
    cert_id = str(uuid.uuid4())
    verification_url = f"https://ordain.church/verify/{cert_id}"
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(verification_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_path = f"{CERT_DIR}/qr_{cert_id}.png"
    qr_img.save(qr_path)
    
    # Generate PDF certificate
    pdf_path = f"{CERT_DIR}/cert_{cert_id}.pdf"
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Certificate design
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(width/2, height - 1.5*inch, "CERTIFICATE OF ORDINATION")
    
    c.setFont("Helvetica", 16)
    c.drawCentredString(width/2, height - 2.3*inch, "This certifies that")
    
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width/2, height - 3*inch, request.minister_name)
    
    c.setFont("Helvetica", 16)
    c.drawCentredString(width/2, height - 3.7*inch, "has been ordained as a minister of")
    
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width/2, height - 4.3*inch, request.denomination)
    
    c.setFont("Helvetica", 14)
    ordination_date = datetime.utcnow().strftime("%B %d, %Y")
    c.drawCentredString(width/2, height - 5*inch, f"Ordained on {ordination_date}")
    
    if request.specializations:
        c.setFont("Helvetica", 12)
        c.drawCentredString(width/2, height - 5.6*inch, f"Specializations: {', '.join(request.specializations)}")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width/2, height - 6.3*inch, f"Certificate ID: {cert_id}")
    c.drawCentredString(width/2, height - 6.6*inch, "Valid in all 50 states")
    
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, height - 7.5*inch, "Scan QR code to verify this certificate")
    
    # Add QR code
    c.drawImage(qr_path, width/2 - 0.75*inch, height - 9*inch, width=1.5*inch, height=1.5*inch)
    
    c.save()
    
    # Save to database
    db_cert = Certificate(
        certificate_id=cert_id,
        user_id=current_user.id,
        certificate_type="ordination",
        minister_name=request.minister_name,
        ordination_date=datetime.utcnow(),
        denomination=request.denomination,
        specializations=request.specializations,
        verification_url=verification_url,
        qr_code_path=qr_path,
        pdf_path=pdf_path
    )
    db.add(db_cert)
    db.commit()
    
    # Read QR code as base64
    with open(qr_path, "rb") as f:
        qr_data = f.read()
    
    import base64
    qr_base64 = base64.b64encode(qr_data).decode()
    
    return CertificateResponse(
        certificate_id=cert_id,
        verification_url=verification_url,
        qr_code_data=f"data:image/png;base64,{qr_base64}",
        pdf_url=f"/api/certificates/download/{cert_id}"
    )

@router.post("/marriage/generate", response_model=CertificateResponse)
async def generate_marriage_certificate(
    request: MarriageCertificateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a marriage certificate with QR code verification"""
    
    cert_id = str(uuid.uuid4())
    verification_url = f"https://ordain.church/verify/{cert_id}"
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(verification_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_path = f"{CERT_DIR}/qr_{cert_id}.png"
    qr_img.save(qr_path)
    
    # Generate PDF certificate
    pdf_path = f"{CERT_DIR}/cert_{cert_id}.pdf"
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Certificate design
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width/2, height - 2*inch, "CERTIFICATE OF MARRIAGE")
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 2.8*inch, "This certifies that")
    
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height - 3.5*inch, request.partner1_name)
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 3.9*inch, "and")
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height - 4.5*inch, request.partner2_name)
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 5.2*inch, f"were united in marriage on {request.ceremony_date}")
    c.drawCentredString(width/2, height - 5.6*inch, f"at {request.ceremony_location}")
    c.drawCentredString(width/2, height - 6*inch, f"Officiated by {request.officiant_name}")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width/2, height - 6.8*inch, f"Certificate Number: {cert_id}")
    
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, height - 7.8*inch, "Scan QR code to verify this certificate")
    
    # Add QR code
    c.drawImage(qr_path, width/2 - 0.75*inch, height - 9*inch, width=1.5*inch, height=1.5*inch)
    
    c.save()
    
    # Save to database
    db_cert = Certificate(
        certificate_id=cert_id,
        user_id=current_user.id,
        certificate_type="marriage",
        partner1_name=request.partner1_name,
        partner2_name=request.partner2_name,
        officiant_name=request.officiant_name,
        ceremony_date=request.ceremony_date,
        ceremony_location=request.ceremony_location,
        verification_url=verification_url,
        qr_code_path=qr_path,
        pdf_path=pdf_path
    )
    db.add(db_cert)
    db.commit()
    
    # Read QR code as base64
    with open(qr_path, "rb") as f:
        qr_data = f.read()
    
    import base64
    qr_base64 = base64.b64encode(qr_data).decode()
    
    return CertificateResponse(
        certificate_id=cert_id,
        verification_url=verification_url,
        qr_code_data=f"data:image/png;base64,{qr_base64}",
        pdf_url=f"/api/certificates/download/{cert_id}"
    )

@router.get("/verify/{certificate_id}", response_model=dict)
async def verify_certificate(certificate_id: str, db: Session = Depends(get_db)):
    """Verify a certificate by ID"""
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    result = {
        "valid": cert.is_verified,
        "certificate_type": cert.certificate_type,
        "issued_at": cert.created_at.isoformat()
    }
    
    if cert.certificate_type == "ordination":
        result.update({
            "minister_name": cert.minister_name,
            "ordination_date": cert.ordination_date.isoformat() if cert.ordination_date else None,
            "denomination": cert.denomination,
            "specializations": cert.specializations
        })
    elif cert.certificate_type == "marriage":
        result.update({
            "partner1_name": cert.partner1_name,
            "partner2_name": cert.partner2_name,
            "officiant_name": cert.officiant_name,
            "ceremony_date": cert.ceremony_date,
            "ceremony_location": cert.ceremony_location
        })
    
    return {"valid": True, "certificate": result}

@router.get("/download/{certificate_id}")
async def download_certificate(certificate_id: str, db: Session = Depends(get_db)):
    """Download certificate PDF"""
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    if not cert.pdf_path or not os.path.exists(cert.pdf_path):
        raise HTTPException(status_code=404, detail="Certificate PDF not found")
    
    with open(cert.pdf_path, "rb") as f:
        pdf_data = f.read()
    
    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=certificate_{certificate_id}.pdf"}
    )

@router.get("/my-certificates", response_model=List[dict])
async def get_user_certificates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all certificates for the current user"""
    certs = db.query(Certificate).filter(Certificate.user_id == current_user.id).all()
    return [
        {
            "certificate_id": c.certificate_id,
            "certificate_type": c.certificate_type,
            "created_at": c.created_at.isoformat(),
            "verification_url": c.verification_url
        } for c in certs
    ]
