"""
AI Ceremony Builder - Generate custom wedding ceremonies with AI
Supports interfaith, LGBTQ+, and traditional ceremonies
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI

router = APIRouter(prefix="/api/ceremony-builder", tags=["ceremony-builder"])

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class CeremonyRequest(BaseModel):
    partner1_name: str
    partner2_name: str
    partner1_pronouns: str = "they/them"
    partner2_pronouns: str = "they/them"
    ceremony_type: str = "traditional"  # traditional, interfaith, lgbtq, secular, spiritual
    traditions: List[str] = []  # e.g., ["Christian", "Jewish", "Hindu"]
    tone: str = "formal"  # formal, casual, romantic, humorous
    length: str = "medium"  # short, medium, long
    include_vows: bool = True
    include_readings: bool = True
    include_rituals: bool = True
    special_requests: Optional[str] = None

class CeremonyResponse(BaseModel):
    ceremony_script: str
    vows: Optional[str] = None
    readings: Optional[List[str]] = None
    rituals: Optional[List[str]] = None
    estimated_duration_minutes: int

@router.post("/generate", response_model=CeremonyResponse)
async def generate_ceremony(request: CeremonyRequest):
    """Generate a custom wedding ceremony using AI"""
    
    # Build the AI prompt
    prompt = f"""Generate a beautiful, inclusive wedding ceremony script for {request.partner1_name} ({request.partner1_pronouns}) and {request.partner2_name} ({request.partner2_pronouns}).

Ceremony Type: {request.ceremony_type}
Traditions to incorporate: {', '.join(request.traditions) if request.traditions else 'None'}
Tone: {request.tone}
Length: {request.length}
Include vows: {request.include_vows}
Include readings: {request.include_readings}
Include rituals: {request.include_rituals}
Special requests: {request.special_requests or 'None'}

Please generate a complete ceremony script that includes:
1. Opening words and welcome
2. Declaration of intent
3. Vows (if requested)
4. Ring exchange
5. Readings (if requested)
6. Rituals (if requested)
7. Pronouncement
8. Closing words

Make it LGBTQ+ affirming, interfaith-friendly, and deeply meaningful. Use gender-neutral language where appropriate and honor the specified traditions.

Format the output as a complete ceremony script that an officiant can read."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an experienced wedding officiant who specializes in creating beautiful, inclusive, and meaningful wedding ceremonies. You are skilled at blending traditions from multiple faiths and creating LGBTQ+ affirming ceremonies."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=2000
        )
        
        ceremony_script = response.choices[0].message.content
        
        # Extract vows if requested
        vows = None
        if request.include_vows:
            vows_prompt = f"""Based on this ceremony, write personalized vows for {request.partner1_name} and {request.partner2_name}. Make them heartfelt and meaningful."""
            vows_response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "You are a wedding vow writer who creates deeply personal and moving vows."},
                    {"role": "user", "content": vows_prompt}
                ],
                temperature=0.8,
                max_tokens=500
            )
            vows = vows_response.choices[0].message.content
        
        # Estimate duration based on length
        duration_map = {
            "short": 15,
            "medium": 30,
            "long": 45
        }
        estimated_duration = duration_map.get(request.length, 30)
        
        return CeremonyResponse(
            ceremony_script=ceremony_script,
            vows=vows,
            readings=[] if request.include_readings else None,
            rituals=[] if request.include_rituals else None,
            estimated_duration_minutes=estimated_duration
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate ceremony: {str(e)}")

@router.get("/templates", response_model=List[dict])
async def get_ceremony_templates():
    """Get pre-built ceremony templates"""
    return [
        {
            "id": "traditional",
            "name": "Traditional Wedding",
            "description": "Classic wedding ceremony with traditional elements",
            "traditions": ["Christian"],
            "estimated_duration": 30
        },
        {
            "id": "interfaith",
            "name": "Interfaith Ceremony",
            "description": "Blend traditions from multiple faiths",
            "traditions": ["Christian", "Jewish", "Hindu", "Muslim"],
            "estimated_duration": 35
        },
        {
            "id": "lgbtq",
            "name": "LGBTQ+ Affirming",
            "description": "Inclusive ceremony celebrating all love",
            "traditions": [],
            "estimated_duration": 30
        },
        {
            "id": "secular",
            "name": "Secular Ceremony",
            "description": "Non-religious ceremony focused on love and commitment",
            "traditions": [],
            "estimated_duration": 25
        },
        {
            "id": "spiritual",
            "name": "Spiritual Union",
            "description": "Spiritual but not religious ceremony",
            "traditions": [],
            "estimated_duration": 30
        },
        {
            "id": "handfasting",
            "name": "Handfasting Ceremony",
            "description": "Celtic/Pagan handfasting tradition",
            "traditions": ["Pagan"],
            "estimated_duration": 35
        }
    ]

@router.get("/traditions", response_model=List[dict])
async def get_available_traditions():
    """Get list of available religious/spiritual traditions"""
    return [
        {"name": "Christian", "description": "Christian wedding traditions"},
        {"name": "Jewish", "description": "Jewish wedding traditions (Ketubah, Chuppah, Seven Blessings)"},
        {"name": "Muslim", "description": "Islamic wedding traditions (Nikah)"},
        {"name": "Hindu", "description": "Hindu wedding traditions (Saptapadi, Seven Steps)"},
        {"name": "Buddhist", "description": "Buddhist wedding traditions"},
        {"name": "Sikh", "description": "Sikh wedding traditions (Anand Karaj)"},
        {"name": "Pagan", "description": "Pagan/Wiccan traditions (Handfasting)"},
        {"name": "Secular", "description": "Non-religious ceremony"},
        {"name": "Humanist", "description": "Humanist ceremony"},
        {"name": "Spiritual", "description": "Spiritual but not religious"}
    ]

@router.get("/rituals", response_model=List[dict])
async def get_available_rituals():
    """Get list of available ceremony rituals"""
    return [
        {
            "name": "Handfasting",
            "description": "Binding hands with cord or cloth to symbolize unity",
            "origin": "Celtic/Pagan",
            "duration_minutes": 5
        },
        {
            "name": "Candle Lighting",
            "description": "Each partner lights a candle, then together light a unity candle",
            "origin": "Christian",
            "duration_minutes": 3
        },
        {
            "name": "Sand Ceremony",
            "description": "Each partner pours sand into a vessel, creating a permanent blend",
            "origin": "Hawaiian/Modern",
            "duration_minutes": 3
        },
        {
            "name": "Stone Ceremony",
            "description": "Partners exchange stones as symbols of commitment",
            "origin": "Modern",
            "duration_minutes": 3
        },
        {
            "name": "Jumping the Broom",
            "description": "Partners jump over a decorated broom together",
            "origin": "African American",
            "duration_minutes": 2
        },
        {
            "name": "Circling",
            "description": "Partners circle each other seven times",
            "origin": "Jewish",
            "duration_minutes": 5
        },
        {
            "name": "Wine/Champagne Ceremony",
            "description": "Partners share wine or champagne",
            "origin": "Various",
            "duration_minutes": 2
        },
        {
            "name": "Rose Ceremony",
            "description": "Partners exchange roses",
            "origin": "Modern",
            "duration_minutes": 3
        }
    ]
