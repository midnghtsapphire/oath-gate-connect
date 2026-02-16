"""
Marriage Laws API - Complete 50-state + territories database
Provides search, filtering, and detailed marriage law information
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
import os
from pydantic import BaseModel

router = APIRouter(prefix="/api/marriage-laws", tags=["marriage-laws"])

# Load marriage laws database
MARRIAGE_LAWS_PATH = os.path.join(os.path.dirname(__file__), "../data/complete_marriage_laws.json")

def load_marriage_laws():
    """Load marriage laws from JSON file"""
    with open(MARRIAGE_LAWS_PATH, "r") as f:
        return json.load(f)

MARRIAGE_LAWS = load_marriage_laws()

class MarriageLaw(BaseModel):
    state: str
    stateCode: str
    minimumAge: int
    minimumAgeWithConsent: int
    waitingPeriod: int
    licenseValidityPeriod: int
    requiresBloodTest: bool
    requiresPhysical: bool
    commonLawMarriageRecognized: bool
    sameGenderMarriageAllowed: bool
    divorceProcedure: str
    residencyRequirement: str
    ordainedMinisterRequirements: str
    notes: str

@router.get("/all", response_model=dict)
async def get_all_marriage_laws():
    """Get all marriage laws for all states"""
    return MARRIAGE_LAWS

@router.get("/states", response_model=List[str])
async def get_all_states():
    """Get list of all state codes"""
    return sorted(MARRIAGE_LAWS.keys())

@router.get("/{state_code}", response_model=MarriageLaw)
async def get_marriage_law_by_state(state_code: str):
    """Get marriage law for a specific state"""
    state_code = state_code.upper()
    if state_code not in MARRIAGE_LAWS:
        raise HTTPException(status_code=404, detail=f"State {state_code} not found")
    return MARRIAGE_LAWS[state_code]

@router.get("/search/query", response_model=List[MarriageLaw])
async def search_marriage_laws(
    q: Optional[str] = Query(None, description="Search query"),
    same_gender: Optional[bool] = Query(None, description="Filter by same-gender marriage allowed"),
    common_law: Optional[bool] = Query(None, description="Filter by common law marriage recognized"),
    min_age: Optional[int] = Query(None, description="Filter by minimum age"),
    no_waiting_period: Optional[bool] = Query(None, description="Filter by no waiting period")
):
    """Search and filter marriage laws"""
    results = []
    
    for state_code, law in MARRIAGE_LAWS.items():
        # Apply filters
        if same_gender is not None and law["sameGenderMarriageAllowed"] != same_gender:
            continue
        if common_law is not None and law["commonLawMarriageRecognized"] != common_law:
            continue
        if min_age is not None and law["minimumAge"] > min_age:
            continue
        if no_waiting_period and law["waitingPeriod"] > 0:
            continue
        
        # Apply search query
        if q:
            query_lower = q.lower()
            if (query_lower in law["state"].lower() or
                query_lower in law["notes"].lower() or
                query_lower in law["ordainedMinisterRequirements"].lower() or
                query_lower in law["divorceProcedure"].lower()):
                results.append(law)
        else:
            results.append(law)
    
    return results

@router.get("/compare/states", response_model=List[MarriageLaw])
async def compare_states(state_codes: str = Query(..., description="Comma-separated state codes")):
    """Compare marriage laws across multiple states"""
    codes = [code.strip().upper() for code in state_codes.split(",")]
    results = []
    
    for code in codes:
        if code in MARRIAGE_LAWS:
            results.append(MARRIAGE_LAWS[code])
    
    if not results:
        raise HTTPException(status_code=404, detail="No valid state codes provided")
    
    return results

@router.get("/stats/summary", response_model=dict)
async def get_marriage_law_statistics():
    """Get summary statistics about marriage laws"""
    total_states = len(MARRIAGE_LAWS)
    same_gender_allowed = sum(1 for law in MARRIAGE_LAWS.values() if law["sameGenderMarriageAllowed"])
    common_law_recognized = sum(1 for law in MARRIAGE_LAWS.values() if law["commonLawMarriageRecognized"])
    no_waiting_period = sum(1 for law in MARRIAGE_LAWS.values() if law["waitingPeriod"] == 0)
    
    avg_min_age = sum(law["minimumAge"] for law in MARRIAGE_LAWS.values()) / total_states
    avg_license_validity = sum(law["licenseValidityPeriod"] for law in MARRIAGE_LAWS.values()) / total_states
    
    return {
        "totalStates": total_states,
        "sameGenderMarriageAllowed": same_gender_allowed,
        "commonLawMarriageRecognized": common_law_recognized,
        "noWaitingPeriod": no_waiting_period,
        "averageMinimumAge": round(avg_min_age, 1),
        "averageLicenseValidityDays": round(avg_license_validity, 1)
    }

@router.get("/lgbtq/affirming", response_model=List[MarriageLaw])
async def get_lgbtq_affirming_states():
    """Get all LGBTQ+ affirming states (same-gender marriage allowed)"""
    return [law for law in MARRIAGE_LAWS.values() if law["sameGenderMarriageAllowed"]]

@router.get("/minister/requirements", response_model=dict)
async def get_minister_requirements_by_state(state_code: str = Query(..., description="State code")):
    """Get ordained minister requirements for a specific state"""
    state_code = state_code.upper()
    if state_code not in MARRIAGE_LAWS:
        raise HTTPException(status_code=404, detail=f"State {state_code} not found")
    
    law = MARRIAGE_LAWS[state_code]
    return {
        "state": law["state"],
        "stateCode": law["stateCode"],
        "ordainedMinisterRequirements": law["ordainedMinisterRequirements"],
        "notes": law["notes"]
    }
