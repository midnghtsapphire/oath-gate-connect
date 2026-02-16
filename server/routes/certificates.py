"""
Digital Certificate Generation with QR Code Verification
Generates ordination certificates and marriage certificates
"""

from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional
import os
import qrcode
from io import BytesIO
from datetime import datetime, timedelta
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors

router = APIRouter(prefix="/api/certificates", tags=["certificates"])

# In-memory certificate storage (in production, use a database)
CERTIFICATES_DB = {}

class OrdainationCertificateRequest(BaseModel):
    name: str
    email: str
    ordination_date: Optional[str] = None
    specializations: Optional[list] = []

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
async def generate_ordination_certificate(request: OrdainationCertificateRequest):
    """Generate an ordination certificate with QR code verification"""
    
    # Generate unique certificate ID
    cert_id = str(uuid.uuid4())
    
    # Set ordination date
    ordination_date = request.ordination_date or datetime.now().strftime("%Y-%m-%d")
    
    # Create certificate data
    cert_data = {
        "id": cert_id,
        "type": "ordination",
        "name": request.name,
        "email": request.email,
        "ordination_date": ordination_date,
        "authority": "Ordain.Church",
        "credentials": "Universal Life Church Ordained Minister",
        "jurisdictions": ["All 50 US States", "District of Columbia", "US Territories"],
        "specializations": request.specializations or ["Wedding Ceremonies", "Vow Renewals", "Commitment Ceremonies"],
        "issued_at": datetime.now().isoformat(),
        "expires_at": None  # Valid indefinitely
    }
    
    # Store in database
    CERTIFICATES_DB[cert_id] = cert_data
    
    # Generate verification URL
    verification_url = f"https://ordain.church/verify/{cert_id}"
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(verification_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_data = qr_buffer.getvalue()
    
    # Generate PDF certificate
    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    width, height = letter
    
    # Certificate design
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width/2, height - 2*inch, "CERTIFICATE OF ORDINATION")
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 2.5*inch, "This certifies that")
    
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width/2, height - 3.2*inch, request.name)
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 3.8*inch, f"has been ordained as a minister on {ordination_date}")
    c.drawCentredString(width/2, height - 4.2*inch, "by Ordain.Church")
    
    c.setFont("Helvetica", 12)
    c.drawCentredString(width/2, height - 5*inch, "Credentials: Universal Life Church Ordained Minister")
    c.drawCentredString(width/2, height - 5.4*inch, f"Certificate Number: {cert_id}")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width/2, height - 6*inch, "Authorized to perform ceremonies in: All 50 US States, DC, and US Territories")
    
    if request.specializations:
        c.drawCentredString(width/2, height - 6.4*inch, f"Specializations: {', '.join(request.specializations)}")
    
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, height - 7.5*inch, "Scan QR code to verify this certificate")
    
    # Add QR code to PDF
    qr_img_path = f"/tmp/qr_{cert_id}.png"
    qr_img.save(qr_img_path)
    c.drawImage(qr_img_path, width/2 - 0.75*inch, height - 9*inch, width=1.5*inch, height=1.5*inch)
    
    c.save()
    pdf_data = pdf_buffer.getvalue()
    
    # Save PDF
    pdf_path = f"/tmp/cert_{cert_id}.pdf"
    with open(pdf_path, "wb") as f:
        f.write(pdf_data)
    
    return CertificateResponse(
        certificate_id=cert_id,
        verification_url=verification_url,
        qr_code_data=f"data:image/png;base64,{qr_data.hex()}",
        pdf_url=f"/api/certificates/download/{cert_id}"
    )

@router.post("/marriage/generate", response_model=CertificateResponse)
async def generate_marriage_certificate(request: MarriageCertificateRequest):
    """Generate a marriage certificate with QR code verification"""
    
    # Generate unique certificate ID
    cert_id = str(uuid.uuid4())
    
    # Create certificate data
    cert_data = {
        "id": cert_id,
        "type": "marriage",
        "partner1_name": request.partner1_name,
        "partner2_name": request.partner2_name,
        "officiant_name": request.officiant_name,
        "ceremony_date": request.ceremony_date,
        "ceremony_location": request.ceremony_location,
        "issued_at": datetime.now().isoformat()
    }
    
    # Store in database
    CERTIFICATES_DB[cert_id] = cert_data
    
    # Generate verification URL
    verification_url = f"https://ordain.church/verify/{cert_id}"
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(verification_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_data = qr_buffer.getvalue()
    
    # Generate PDF certificate
    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
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
    
    c.setFont("Helvetica", 12)
    c.drawCentredString(width/2, height - 6.8*inch, f"Certificate Number: {cert_id}")
    
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, height - 7.8*inch, "Scan QR code to verify this certificate")
    
    # Add QR code to PDF
    qr_img_path = f"/tmp/qr_{cert_id}.png"
    qr_img.save(qr_img_path)
    c.drawImage(qr_img_path, width/2 - 0.75*inch, height - 9*inch, width=1.5*inch, height=1.5*inch)
    
    c.save()
    pdf_data = pdf_buffer.getvalue()
    
    # Save PDF
    pdf_path = f"/tmp/cert_{cert_id}.pdf"
    with open(pdf_path, "wb") as f:
        f.write(pdf_data)
    
    return CertificateResponse(
        certificate_id=cert_id,
        verification_url=verification_url,
        qr_code_data=f"data:image/png;base64,{qr_data.hex()}",
        pdf_url=f"/api/certificates/download/{cert_id}"
    )

@router.get("/verify/{certificate_id}", response_model=dict)
async def verify_certificate(certificate_id: str):
    """Verify a certificate by ID"""
    if certificate_id not in CERTIFICATES_DB:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    cert_data = CERTIFICATES_DB[certificate_id]
    return {
        "valid": True,
        "certificate": cert_data
    }

@router.get("/download/{certificate_id}")
async def download_certificate(certificate_id: str):
    """Download certificate PDF"""
    if certificate_id not in CERTIFICATES_DB:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    pdf_path = f"/tmp/cert_{certificate_id}.pdf"
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Certificate PDF not found")
    
    with open(pdf_path, "rb") as f:
        pdf_data = f.read()
    
    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=certificate_{certificate_id}.pdf"}
    )
