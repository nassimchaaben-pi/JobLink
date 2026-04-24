# JobLink Final Gaps Checklist (DB Last)

This checklist tracks remaining gaps when delivering the project with fake/in-memory data first, then DB as the last step.

## Product Features

- [x] Candidate authentication and role-based access.
- [x] Recruiter authentication and role-based access.
- [x] Admin authentication and role-based access.
- [x] Candidate profile update workflow.
- [x] Public jobs listing and filtering.
- [x] Candidate application submission and tracking.
- [x] Recruiter job creation and applications review.
- [x] Recruiter application status update workflow.
- [x] AI matching endpoint and dashboard integration.
- [x] Assistant chatbot endpoint and dashboard integration.
- [x] Interview simulation flow and feedback integration.

## Architecture and Delivery

- [x] Backend modularized into routes/controllers/services.
- [x] Frontend route architecture for landing/login/role dashboards.
- [x] Shared API client and typed frontend models.
- [x] Product spec document.
- [x] Backlog/sprint breakdown document.
- [x] Progress tracking document.

## Remaining Gaps (can be completed after today)

- [ ] Replace in-memory mode with mandatory MySQL mode in all environments.
- [ ] Add migration strategy (`prisma migrate`) and seed scripts.
- [ ] Add CV upload and parsing pipeline (file storage + parser + queue).
- [ ] Add stronger chatbot/LLM integration with safety policies.
- [ ] Add embedding-based NLP matching model.
- [ ] Add unit/integration/e2e test suites.
- [ ] Add CI pipeline and deployment manifests.
- [ ] Add privacy workflows (data export, deletion, consent audit UI).

## Next Priority (recommended order)

1. Stabilize DB setup on local machine and run in DB mode.
2. Add CV parser pipeline.
3. Improve AI quality (matching + assistant).
4. Add testing and CI.
5. Harden compliance/security operations.
