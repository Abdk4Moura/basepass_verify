# **App Name**: BasePass Verify

## Core Features:

- Secure Code Generation: Sponsors (authorized personnel) generate unique, time-limited, cryptographically secure access codes (e.g., QR codes) for visitors.
- Mobile Verification: Checkpoint personnel use a mobile PWA to scan/verify visitor codes, view details, and log entry/exit.
- Offline Capability: The PWA operates offline, storing verification data locally and syncing when a network connection is available.
- Audit Trail: All actions (code creation, verification, logins) are logged securely, providing a full audit trail.
- User Management: Administrators manage user access, roles, and system configurations.

## Style Guidelines:

- Primary color: Use a muted military green (#556B2F) to convey authority and security.
- Secondary color: A light gray (#D3D3D3) for backgrounds and less prominent elements.
- Accent: Use a vibrant alert orange (#FF4500) for important actions and alerts to draw immediate attention.
- Use clear, sans-serif fonts for readability, especially on the PWA used by checkpoint personnel.
- Employ simple, recognizable icons for actions and status indicators. Ensure icons are easily understood, even in low-light conditions.
- Maintain a clean, uncluttered layout with sufficient spacing for ease of use on mobile devices. Prioritize key information for quick scanning.

## Original User Request:
2. BasePass: Project Summary for Execution
Project Name: BasePass
Goal: To develop and implement a secure, efficient, and user-friendly digital visitor verification system for military bases.
Problem Addressed: Replaces insecure, inefficient, and error-prone manual/paper-based visitor logging systems. Addresses the lack of real-time tracking, poor auditability, and potential failures in areas with unreliable network connectivity.
Core Concept: Authorized military personnel ("Sponsors") register visitors and generate unique, time-limited, cryptographically secure access codes (e.g., QR codes). Visitors present these codes at checkpoints. Security personnel ("Checkpoint Personnel") use a dedicated mobile application (PWA) to scan/verify the codes, view visitor details, and log entry/exit. The system provides a full audit trail.
Key Features:
Secure Code Generation: Sponsors create time-bound visitor passes.
Mobile Verification (PWA): Checkpoint staff verify codes quickly using a mobile app.
Offline Capability: The checkpoint app works even without internet, syncing later.
Audit Trail: All actions (code creation, verification, logins) are logged securely.
User Management: Administrators control user access and roles.
Target Users:
Sponsors: Military personnel authorizing visitor access.
Checkpoint Personnel: Guards/staff at base entry points.
Administrators: Personnel managing the system and users.
Technology Stack:
Backend: IHP (Integrated Haskell Platform) - Haskell
Frontend: React (for Sponsor/Admin web interface and Checkpoint PWA)
Database: PostgreSQL
Key Technologies: PWA features (Service Workers, Offline Storage), Cryptographic code generation, RESTful API or IHP's built-in communication.
Key Deliverables:
A web application (built with <Backend>/React(/Maybe Next) for Sponsors and Administrators.
A Progressive Web Application (PWA) (built with React) for Checkpoint Personnel, featuring offline capabilities.
A secure backend API  connecting the frontend components and the database.
Database schema for PostgreSQL.
Scope Limitations (Initial): No direct integration with existing personnel databases or physical access control hardware. Focus is on the core visitor registration, code generation/verification, and logging workflow.
Execution Focus: Implement the user roles, code generation/verification logic, PWA with offline sync, audit trail, and administrative functions using the specified technology stack, ensuring security and usability are prioritized.
These documents should provide a clear understanding of the project's requirements and overall structure for someone tasked with building it.
  