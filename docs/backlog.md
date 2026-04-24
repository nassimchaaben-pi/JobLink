# JobLink Delivery Backlog (From Spec)

## Epic 1 - Platform Foundation

### Story E1-S1: Project architecture baseline
**As a** developer
**I want** a clean backend/frontend structure
**So that** features are added consistently.

**Acceptance criteria**
- Backend has modular folders (`config`, `routes`, `controllers`, `middlewares`, `services`).
- Frontend has route-based pages for each role.
- Shared error handling and health endpoints are available.

### Story E1-S2: Environment and configuration
**As a** developer
**I want** centralized config loading
**So that** environments are predictable.

**Acceptance criteria**
- Backend validates required env vars.
- App can start with safe defaults in local dev.
- `.env.example` documents expected variables.

### Story E1-S3: Database connectivity
**As a** backend service
**I want** stable MySQL connection pooling
**So that** API calls can persist and read data.

**Acceptance criteria**
- DB pool initialization exists.
- Health check reports DB availability.
- Errors are logged and handled gracefully.

## Epic 2 - Authentication and Authorization

### Story E2-S1: User registration and login
**As a** user
**I want** to register and log in securely
**So that** I can access role-based features.

**Acceptance criteria**
- Endpoints: register, login, me.
- Passwords are hashed.
- JWT access token is returned on login.

### Story E2-S2: Role-based access control
**As a** platform admin
**I want** role-protected routes
**So that** users only see authorized resources.

**Acceptance criteria**
- Middleware validates token and role.
- Candidate/recruiter/admin routes are protected.
- Unauthorized access returns proper error codes.

## Epic 3 - Candidate Journey

### Story E3-S1: Candidate profile management
**As a** candidate
**I want** to manage my profile
**So that** the system can match me better.

**Acceptance criteria**
- Candidate can read/update profile data.
- Validation exists for required fields.

### Story E3-S2: CV upload and parsing trigger
**As a** candidate
**I want** to upload my CV
**So that** my profile can be enriched automatically.

**Acceptance criteria**
- File upload endpoint exists.
- Metadata is stored and parsing job is triggered.
- User sees parsing status.

### Story E3-S3: Job applications tracking
**As a** candidate
**I want** to apply and track statuses
**So that** I can manage my job search.

**Acceptance criteria**
- Apply endpoint exists.
- Candidate sees timeline/status changes.

## Epic 4 - Recruiter Journey

### Story E4-S1: Job posting management
**As a** recruiter
**I want** to create and edit jobs
**So that** I can attract relevant candidates.

**Acceptance criteria**
- Recruiter can CRUD job offers.
- Jobs have publish/unpublish status.

### Story E4-S2: Candidate pipeline actions
**As a** recruiter
**I want** to move candidates across stages
**So that** hiring workflow is structured.

**Acceptance criteria**
- Status update endpoint exists.
- Stage transitions are audited.

## Epic 5 - AI Matching

### Story E5-S1: Matching score generation
**As a** candidate/recruiter
**I want** score-based match lists
**So that** I can prioritize strong opportunities.

**Acceptance criteria**
- Matching endpoint computes score 0-100.
- Explanation payload includes top reasons and gaps.

### Story E5-S2: Match quality monitoring
**As a** product owner
**I want** basic model quality metrics
**So that** we can iterate safely.

**Acceptance criteria**
- Logs include score distributions.
- Feedback data can be stored for recalibration.

## Epic 6 - Assistant and Interview Simulation

### Story E6-S1: Virtual assistant
**As a** candidate
**I want** AI guidance in context
**So that** I improve applications and readiness.

**Acceptance criteria**
- Chat session/message persistence exists.
- Assistant can answer role-specific prompts.

### Story E6-S2: Interview simulation
**As a** candidate
**I want** mock interviews with feedback
**So that** I improve my interview performance.

**Acceptance criteria**
- Session creation and answer submission endpoints exist.
- Per-question and summary feedback is generated.

## Epic 7 - Security, Compliance, and Operations

### Story E7-S1: GDPR baseline
**As a** user
**I want** data transparency and deletion options
**So that** my personal data is protected.

**Acceptance criteria**
- Consent is captured and stored.
- Account/data deletion workflow exists.

### Story E7-S2: CI/CD and monitoring
**As a** team
**I want** automated quality and deployment checks
**So that** releases are safe and repeatable.

**Acceptance criteria**
- CI runs lint/test/build.
- Staging deploy and health checks are automated.

---

## Sprint Backlog Mapping (8 weeks)

### Sprint 1 (Weeks 1-2)
- E1-S1, E1-S2, E1-S3
- E2-S1 (partial), E2-S2 (skeleton)

### Sprint 2 (Weeks 3-4)
- E2-S1 completion, E2-S2 completion
- E3-S1, E3-S3
- E4-S1

### Sprint 3 (Weeks 5-6)
- E3-S2
- E5-S1, E5-S2
- E6-S1, E6-S2 (MVP)

### Sprint 4 (Weeks 7-8)
- E4-S2
- E7-S1, E7-S2
- UAT, bug fixing, hardening, release
