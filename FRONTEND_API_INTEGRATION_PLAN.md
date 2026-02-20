# Frontend API Integration Plan

## Current State
- ✅ API client created (`src/lib/api.ts`)
- ✅ AuthModal connected to real auth APIs
- ❌ Marriage law search uses hardcoded data
- ❌ Ceremony builder UI not built
- ❌ Certificate generator UI not built
- ❌ Dashboard not built

## Integration Tasks

### 1. Marriage Laws (Index.tsx)
- ✅ Created `useMarriageLaws` hook
- TODO: Update Index.tsx to use hook instead of STATES_DATA
- TODO: Show loading state while fetching
- TODO: Handle API errors gracefully

### 2. Ceremony Builder Page
- TODO: Create CeremonyBuilder.tsx page
- TODO: Form for ceremony parameters
- TODO: Call `/api/ceremony-builder/generate`
- TODO: Display generated ceremony
- TODO: Save/download functionality

### 3. Certificate Generator Page
- TODO: Create CertificateGenerator.tsx page
- TODO: Forms for ordination & marriage certificates
- TODO: Call `/api/certificates/ordination/generate`
- TODO: Call `/api/certificates/marriage/generate`
- TODO: Display QR code and download link

### 4. Dashboard Page
- TODO: Create Dashboard.tsx page
- TODO: Show user info from `/api/auth/me`
- TODO: List saved ceremonies from `/api/ceremony-builder/my-ceremonies`
- TODO: List certificates from `/api/certificates/my-certificates`
- TODO: Subscription status from `/api/billing/subscription`

## Priority
Since backend is complete and working, frontend integration is the final step before deployment.
