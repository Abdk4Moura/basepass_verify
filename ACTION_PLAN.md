# ACTION_PLAN.md

This document outlines the identified deficiencies in the current BasePass Verify application codebase when compared against the requirements in `docs/blueprint.md`. It also proposes a set of actions to address these issues.

## I. Summary of Deficiencies

1.  **Backend & Database Mismatch:**
    *   **Deficiency:** The required IHP/Haskell backend and PostgreSQL database are not implemented. The system currently uses an external custom backend (on Google Cloud Run) and Firebase for some data aspects.
    *   **Impact:** Core logic, security, data integrity, and scalability may significantly differ from the blueprint's intentions. The backend source code is not in this repository.

2.  **Missing PWA/Offline Capabilities for Checkpoint App:**
    *   **Deficiency:** The Checkpoint app lacks critical PWA features (no manifest, no service worker) and offline data storage/synchronization.
    *   **Impact:** Fails the requirement for reliable operation in areas with poor network connectivity.

3.  **Incomplete/Mocked Core Functionalities:**
    *   **Checkpoint Mobile Verification:** QR code scanning is mocked. Grant/Deny access actions are not implemented.
    *   **Audit Trail:** Admin UI for audit trails is entirely mocked, with no connection to backend data.
    *   **User Management:** Admin UI for user management is non-functional and not connected to backend operations.
    *   **Impact:** The application is largely non-functional for Checkpoint and Administrator roles.

4.  **Incorrect Color Scheme Implementation:**
    *   **Deficiency:** The primary (Muted Military Green `#556B2F`) and accent (Vibrant Alert Orange `#FF4500`) colors are incorrectly defined in the application's theme.
    *   **Impact:** The visual identity and user experience do not align with style guidelines.

5.  **Undocumented AI Feature Integration:**
    *   **Deficiency:** AI features (using Genkit) are present but not documented in the `docs/blueprint.md`.
    *   **Impact:** Scope deviation. While potentially an enhancement, it needs documentation and alignment with project goals.

6.  **Builds Ignore TypeScript/ESLint Errors:**
    *   **Deficiency:** The build process is configured to ignore TypeScript and ESLint errors.
    *   **Impact:** Increased risk of bugs, reduced code quality, and higher maintenance overhead.

## II. Proposed Action Plan

1.  **Re-evaluate Backend and Database Strategy:**
    *   **Action:** Urgent discussion and decision required on whether to:
        *   Align with the blueprint (migrate to IHP/Haskell and PostgreSQL). This would be a major overhaul.
        *   Update the blueprint to reflect the current architecture (custom backend, Firebase) and document it thoroughly (including the backend codebase).
    *   **Priority:** Critical.

2.  **Implement PWA and Offline Capabilities for Checkpoint App:**
    *   **Action:** Integrate PWA features (manifest, service worker). Implement robust offline data storage (e.g., IndexedDB) and a synchronization mechanism for the Checkpoint app.
    *   **Priority:** High.

3.  **Develop Core Application Functionalities:**
    *   **Checkpoint App:** Integrate a QR code scanning library. Implement API calls for code verification and logging entry/exit.
    *   **Audit Trail:** Connect the admin UI to backend API endpoints for fetching and displaying real audit logs. Implement log export functionality.
    *   **User Management:** Develop the admin UI for full user CRUD operations and role management, with corresponding backend API integrations.
    *   **Priority:** High.

4.  **Correct Color Scheme:**
    *   **Action:** Update the HSL values in `src/app/globals.css` for the `--primary` and `--accent` (and related, e.g., `--alert`) CSS variables to accurately represent `#556B2F` (Muted Military Green) and `#FF4500` (Vibrant Alert Orange).
    *   **Priority:** Medium.

5.  **Document AI Features:**
    *   **Action:** If the AI features are to be retained, update `docs/blueprint.md` or create supplementary documentation detailing their purpose, functionality, and integration.
    *   **Priority:** Medium.

6.  **Enforce Stricter Build Quality:**
    *   **Action:** Modify the `next.config.ts` to remove the `ignoreBuildErrors` for TypeScript and ESLint. Address any existing errors to ensure a clean build.
    *   **Priority:** Medium.

7.  **Clarify Secure Code Generation & Audit Logging Details (Backend Dependent):**
    *   **Action:** Once the backend strategy is clarified (Action 1), ensure documentation and, if possible, code review of the backend components responsible for secure code generation and comprehensive audit logging.
    *   **Priority:** High (contingent on Action 1).
