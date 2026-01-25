# NutriClin MVP Completion Plan

## Overview
Act as a Senior Full-Stack Engineer to finalize the NutriClin MVP. Focus on UI consistency (Coral/Cream design system), robust auth flow, navigation mapping, Supabase CRUD integration, and Storage implementation for media.

**Project Type:** WEB (React/Vite)

## Success Criteria
- [ ] LoginPage matches the internal dashboard's modern aesthetic.
- [ ] 100% functional navigation without "dead buttons".
- [ ] All forms (Patients, Anamnesis, Meal Plans) save correctly to Supabase.
- [ ] Supabase Storage implemented for Avatar, Logo, and Recipe images.
- [ ] Consistent "Back" buttons and standardized UI across all internal screens.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend/DB: Supabase (Auth, Postgres, Storage)
- State: React Context (UserContext), local state for UI views.

## File Structure (Key Files)
- `components/LoginPage.tsx`: Authentication UI.
- `App.tsx`: Main router and view orchestrator.
- `services/storageService.ts`: New service for Supabase Storage.
- `components/ui/`: Standardized UI components (Button, Input).

## Task Breakdown

### Phase 1: UI/UX & AUTH
- [ ] **Task 1.1: Modernize LoginPage.tsx** (Agent: `frontend-specialist`)
  - INPUT: Current LoginPage.tsx, index.css tokens.
  - OUTPUT: Updated LoginPage.tsx with Coral/Cream style and spring animations.
  - VERIFY: Design fits the palette, responsive on mobile.
- [ ] **Task 1.2: Validate Auth Persistence** (Agent: `frontend-specialist`)
  - INPUT: App.tsx useEffect.
  - OUTPUT: Reliable session handling.
  - VERIFY: Refreshing page doesn't logout user.

### Phase 2: Navigation & Flow
- [ ] **Task 2.1: Navigation Audit & dead-button mapping** (Agent: `frontend-specialist`)
  - INPUT: App.tsx and all components.
  - OUTPUT: List of unlinked actions.
  - VERIFY: Every button triggers a view change or action.
- [ ] **Task 2.2: Standardize "Back" button and padding** (Agent: `frontend-specialist`)
  - INPUT: Internal screens (PatientDetail, MealPlanCreator, etc.).
  - OUTPUT: Unified navigation headers with Back buttons.
  - VERIFY: Consistent UX across all views.

### Phase 3: Supabase & CRUD
- [ ] **Task 3.1: Verify Table Schemas** (Agent: `database-architect`)
  - INPUT: Current DB state.
  - OUTPUT: SQL migrations if needed for missing tables.
  - VERIFY: Tables exist for anamnesis, meal plans, etc.
- [ ] **Task 3.2: Connect Forms to Supabase** (Agent: `backend-specialist`)
  - INPUT: PatientForm, RecipeForm, MealPlanCreator.
  - OUTPUT: Service calls to Supabase for saving data.
  - VERIFY: Data persists in DB and updates UI.

### Phase 4: Media & Storage
- [ ] **Task 4.1: Implementation of storageService.ts** (Agent: `backend-specialist`)
  - INPUT: Supabase client.
  - OUTPUT: Service with upload/delete methods.
  - VERIFY: Files appear in Supabase buckets.
- [ ] **Task 4.2: Integrate Image Upload in UI** (Agent: `frontend-specialist`)
  - INPUT: SettingsPage (Logo/Avatar), PatientForm (Patient Photo).
  - OUTPUT: Working upload inputs with progress feedback.
  - VERIFY: Images display correctly after upload.

## Phase X: Verification
- [ ] Run `python .agent/scripts/checklist.py .`
- [ ] Run `npm run build`
- [ ] Manual walkthrough of the entire user journey.
