# JobLink Product Specification and Delivery Plan

## 1) Product Overview

### Vision
Build an intelligent recruitment platform that connects students and recent graduates with recruiters through AI-powered matching, guided support, and interview preparation.

### Business Goal
- Reduce time-to-hire for entry-level roles.
- Increase relevance of candidate-job matches.
- Improve candidate readiness through coaching and mock interviews.

### Target Users
- **Primary**: students and recent graduates.
- **Secondary**: recruiters hiring junior talent.
- **Internal**: admins and operations team.

### Success Metrics (MVP)
- Match click-through rate (CTR) >= 25%.
- Application completion rate >= 40%.
- Candidate weekly retention >= 30%.
- Recruiter shortlisting rate >= 15%.

## 2) Scope

### MVP (8 weeks)
- Candidate and recruiter accounts with role-based access.
- CV upload and profile management.
- Job posting and candidate application flow.
- AI matching score with basic explanation.
- Virtual assistant chatbot (career guidance + platform help).
- Interview simulation module (text-based questions + feedback).
- Responsive web app (desktop/mobile web).

### V1+ (Post-MVP)
- Native mobile app packaging (Capacitor/Ionic).
- Voice-based interview simulation.
- Advanced recruiter pipeline analytics.
- Automated CV tailoring suggestions by job.

## 3) Functional Requirements

### Candidate Features
- Sign up / login / password reset.
- Complete profile (education, skills, experiences, preferences).
- Upload CV (PDF/DOCX), parse content, and edit extracted fields.
- Browse AI-matched jobs with score and reasons.
- Save jobs and submit applications.
- Track application status timeline.
- Chat with assistant for career and interview advice.
- Practice mock interviews and receive structured feedback.

### Recruiter Features
- Create and manage company profile.
- Create/edit/publish job offers.
- View matched candidates for each offer.
- Manage candidate pipeline stages (new, screening, interview, offer, rejected).
- Add notes and status updates.

### Admin Features
- Manage users and roles.
- Moderate content and job postings.
- View platform and model performance metrics.
- Access audit logs and incident records.

## 4) Non-Functional Requirements

### Security
- JWT auth with refresh strategy.
- Password hashing (Argon2 or bcrypt).
- Role-based authorization (Candidate/Recruiter/Admin).
- Input validation and output sanitization.
- API rate limiting and CORS policy.
- Secrets in environment variables only.

### Privacy and Compliance
- Consent collection for CV processing and AI usage.
- Data minimization and retention policy.
- Right-to-access and right-to-delete workflows.
- Audit trail for sensitive operations.
- GDPR-aligned processing documentation.

### Performance
- API P95 latency < 500ms for standard CRUD endpoints.
- Match response P95 < 2s for common profile/job sizes.
- Async processing for heavy tasks (CV parsing, scoring refresh).

### Reliability and Observability
- Structured logs and request tracing.
- Health endpoints (`/health`, `/ready`).
- Error monitoring and alerting.
- Daily backups for MySQL.

## 5) Technical Architecture (Current Stack Aligned)

### Frontend
- **Framework**: Angular (existing project in `frontend/`).
- **Responsibilities**: UI, route guards, forms, API integration, responsive UX.

### Backend
- **Framework**: Node.js + Express (existing project in `backend/`).
- **Responsibilities**: Auth, business logic, API orchestration, RBAC.

### Database
- **Engine**: MySQL (existing dependency `mysql2`).
- **Responsibilities**: transactional data for users, jobs, applications, scores.

### AI Service (Recommended)
- **Approach**: Separate NLP service (Python FastAPI preferred) for embedding and scoring.
- **Fallback**: Node-based integration with external AI APIs for MVP.

### Storage
- CV file storage in object storage (S3-compatible).
- DB keeps metadata and parsed text references.

## 6) Data Model (High-Level)

- `users` (id, email, password_hash, role, status, created_at)
- `candidate_profiles` (user_id, first_name, last_name, location, summary)
- `educations` (profile_id, school, degree, field, start_date, end_date)
- `experiences` (profile_id, company, title, description, dates)
- `skills` (id, name, category)
- `candidate_skills` (profile_id, skill_id, level)
- `companies` (id, recruiter_user_id, name, website, industry)
- `jobs` (id, company_id, title, description, location, type, status)
- `job_skills` (job_id, skill_id, weight)
- `cvs` (id, profile_id, file_url, file_type, parsed_text, parsed_at)
- `applications` (id, job_id, candidate_user_id, status, applied_at)
- `application_events` (application_id, from_status, to_status, note, actor_id)
- `match_scores` (candidate_user_id, job_id, score, reasons_json, updated_at)
- `chat_sessions` (id, user_id, context_type, created_at)
- `chat_messages` (session_id, sender, content, created_at)
- `interview_sessions` (id, user_id, role_target, level_target, started_at, completed_at)
- `interview_questions` (id, session_id, prompt, expected_topics)
- `interview_answers` (question_id, answer_text, score_json)
- `audit_logs` (actor_id, action, target_type, target_id, metadata, created_at)

## 7) API Specification (MVP)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Candidate
- `GET /api/candidates/me`
- `PUT /api/candidates/me`
- `POST /api/candidates/me/cv`
- `GET /api/candidates/me/matches`
- `GET /api/candidates/me/applications`
- `POST /api/jobs/:id/apply`

### Recruiter
- `POST /api/recruiters/jobs`
- `GET /api/recruiters/jobs`
- `PUT /api/recruiters/jobs/:id`
- `GET /api/recruiters/jobs/:id/candidates`
- `PATCH /api/applications/:id/status`

### AI and Assistance
- `POST /api/ai/match/score`
- `POST /api/assistant/chat`
- `POST /api/interview/sessions`
- `POST /api/interview/sessions/:id/answer`
- `GET /api/interview/sessions/:id/feedback`

### Platform
- `GET /api/health`
- `GET /api/ready`

### API Conventions
- Versioning: `/api/v1/...` recommended.
- Error format: `{ code, message, details, requestId }`.
- Pagination: `page`, `pageSize`, `total`.

## 8) AI/NLP Matching Specification

### Inputs
- Candidate profile structured fields.
- CV parsed text.
- Job title + description + required skills.

### Pipeline
1. Text normalization (language cleanup, deduplication).
2. Skill/entity extraction.
3. Embedding generation (CV and job vectors).
4. Composite scoring:
   - semantic similarity,
   - skill overlap,
   - experience/education constraints,
   - optional location preference.
5. Explainability generation (top matching reasons + missing skills).

### Output
- `score` from 0 to 100.
- `reasons[]` (why it matches).
- `gaps[]` (missing skills/requirements).

### Model Monitoring
- Drift checks (input distribution).
- Offline quality benchmark set.
- Weekly calibration with recruiter feedback.

## 9) Chatbot Specification

### Use Cases
- Candidate guidance on profile quality.
- Job search and application tips.
- Interview preparation guidance.
- FAQ and platform navigation.

### Guardrails
- No legal/medical/financial definitive advice.
- No disclosure of other users' private data.
- Clear confidence and limitation messaging.

### Context Sources
- User role + profile completeness.
- Current applications and target jobs.
- Standard prompt templates by scenario.

## 10) Interview Simulation Specification

### MVP Flow
1. Candidate selects role and difficulty.
2. System serves 5-10 role-specific questions.
3. Candidate answers in text.
4. System scores answers on rubric.
5. Candidate receives improvement actions.

### Scoring Rubric
- Relevance to question.
- Clarity and structure.
- Technical correctness (if technical role).
- Communication quality.

### Outputs
- Per-question score and notes.
- Session summary score.
- Personalized next-step recommendations.

## 11) Gap Analysis (Current Project vs Target)

### Current State (Observed)
- Frontend is Angular and mostly a landing page.
- Backend is Express with only root route.
- MySQL dependency exists but no schema/migrations.
- No auth, no role model, no APIs for business features.
- No AI service, chatbot, or interview logic.
- No test strategy beyond default scaffolding.

### Gaps to Close
- **Platform foundation**: environment config, architecture folders, coding conventions.
- **Data layer**: schema design, migrations, seed data.
- **Auth & RBAC**: registration/login and protected routes.
- **Feature APIs**: jobs, profiles, applications, status workflows.
- **AI layer**: NLP scoring service and explainability payload.
- **Assistant**: conversation storage + safe orchestration.
- **Interview module**: question bank + scoring engine.
- **Frontend product flows**: candidate/recruiter dashboards and forms.
- **Security/compliance**: retention, deletion, consent logging.
- **DevOps**: CI/CD, staging/prod deploy, monitoring.

### Risks
- Inaccurate CV parsing for mixed language/format files.
- Match quality trust if explanations are weak.
- Scope overload in 8 weeks without strict MVP boundaries.
- Data privacy risk if consent/deletion is delayed.

### Mitigations
- Use async parsing with manual correction UI.
- Expose transparent score factors from day one.
- Freeze MVP scope at end of Sprint 1.
- Build compliance features no later than Sprint 3.

## 12) Agile Delivery Plan (8 Weeks / 4 Sprints)

### Sprint 1 (Weeks 1-2): Foundations and Design
- Finalize user stories and acceptance criteria.
- Define DB schema and migration system.
- Implement auth + RBAC skeleton.
- Create Angular app structure (routes, guards, shared services).
- Prepare base UI wireframes and component library.

**Deliverables**
- Architecture decision record.
- Initial schema + migration scripts.
- Auth API and protected frontend routes.

### Sprint 2 (Weeks 3-4): Core Business Features
- Candidate profile CRUD and CV upload endpoint.
- Recruiter job CRUD and listing.
- Application submission and status tracking.
- Basic dashboard views for both roles.

**Deliverables**
- End-to-end flow: candidate applies to job.
- Recruiter can review and update candidate status.

### Sprint 3 (Weeks 5-6): AI and Intelligence Features
- Integrate NLP matching service.
- Store and display score explanations.
- Implement assistant chatbot MVP.
- Implement interview simulation MVP (text mode).

**Deliverables**
- Candidate receives ranked matches + reasons.
- Candidate can run interview practice and get feedback.

### Sprint 4 (Weeks 7-8): Hardening, Testing, Release
- End-to-end QA and bug fixing.
- Security and privacy controls completion.
- Performance optimization and observability setup.
- Pilot release with selected users.

**Deliverables**
- Production-ready deployment.
- Final test report and launch checklist.

## 13) Testing Strategy

- **Unit tests**: service logic, validators, score calculators.
- **Integration tests**: API + DB flows (auth, applications, matching).
- **E2E tests**: candidate and recruiter critical journeys.
- **Security tests**: auth bypass, injection, rate-limit checks.
- **UAT**: pilot users from student/recruiter segments.

## 14) Definition of Done (DoD)

- Feature meets acceptance criteria.
- Unit/integration tests pass in CI.
- No critical/high security issues open.
- API documentation updated.
- Observability hooks added (logs/metrics/errors).
- Privacy impact considered and documented.
- Product owner validation completed.

## 15) Implementation Checklist

### Backend
- [ ] Project structure (`routes`, `controllers`, `services`, `middlewares`, `db`).
- [ ] Migration tool (Prisma/Knex/Sequelize) selected and configured.
- [ ] Auth + RBAC implemented.
- [ ] Jobs, profiles, applications endpoints complete.
- [ ] AI proxy/orchestration layer complete.

### Frontend
- [ ] Route map and role-based guards complete.
- [ ] Candidate and recruiter dashboard screens complete.
- [ ] CV upload + profile forms complete.
- [ ] Match list and details screens complete.
- [ ] Assistant and interview screens complete.

### AI and Data
- [ ] CV parsing and normalization pipeline.
- [ ] Embedding and scoring workflow.
- [ ] Explainability payload integrated in UI.
- [ ] Monitoring and feedback loop.

### DevOps and Quality
- [ ] CI pipeline for lint/test/build.
- [ ] Staging and production deployment scripts.
- [ ] Backup, monitoring, and alerting setup.
- [ ] Incident response and rollback basics.

---

## Appendix A: Recommended Next Technical Decisions

1. Choose ORM/migration stack (Prisma recommended for speed).
2. Decide AI service boundary (in-repo Python service vs external API).
3. Select file storage provider for CV uploads.
4. Define event queue strategy for async tasks (BullMQ/Redis recommended).
