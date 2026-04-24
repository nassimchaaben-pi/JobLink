const fs = require("fs");

const files = {
  "foundation.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,Foundation and Architecture,"Core backend structure and system foundation",High,Done,backend;architecture,Foundation and Architecture,
Story,Backend modular architecture bootstrap,"Refactor backend into modular structure",High,Done,backend;architecture,,Foundation and Architecture
Story,Environment and health-check setup,"Add env config and health endpoints",High,Done,backend;config;observability,,Foundation and Architecture
Story,Persistence strategy with DB-ready fallback,"Prisma + memory fallback",High,Done,backend;prisma;persistence;demo,,Foundation and Architecture`,

  "auth.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,Authentication and Access Control,"Auth and RBAC",High,Done,auth;security,Authentication and Access Control,
Story,Auth API and JWT session management,"JWT login/register/me",High,Done,backend;auth;security,,Authentication and Access Control
Story,Role-based route protection,"RBAC enforcement",High,Done,auth;rbac;frontend;backend,,Authentication and Access Control`,

  "candidate.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,Candidate Experience,"Candidate workflows",High,Done,candidate,Candidate Experience,
Story,Candidate profile management,"Profile APIs + UI",High,Done,candidate;profile;api;frontend,,Candidate Experience
Story,Job discovery and applications flow,"Search + apply flow",High,Done,candidate;jobs;applications,,Candidate Experience
Story,Candidate dashboard premium demo UX,"UI redesign",Medium,Done,ui;ux;candidate;demo,,Candidate Experience`,

  "recruiter.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,Recruiter Experience,"Recruiter workflows",High,Done,recruiter,Recruiter Experience,
Story,Recruiter jobs CRUD-lite,"Jobs + pipeline",High,Done,recruiter;jobs;pipeline,,Recruiter Experience
Story,Recruiter dashboard premium demo UX,"Dashboard redesign",Medium,Done,ui;ux;recruiter;demo,,Recruiter Experience`,

  "admin.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,Admin and Analytics,"Admin tools",High,Done,admin;analytics,Admin and Analytics,
Story,Admin metrics and user APIs,"Metrics + users",High,Done,admin;analytics;api,,Admin and Analytics
Story,Admin dashboard visuals,"Analytics UI",Medium,Done,admin;dashboard;ui;analytics;demo,,Admin and Analytics`,

  "ai.csv": `Issue Type,Summary,Description,Priority,Status,Labels,Epic Name,Epic Link
Epic,AI Features,"AI modules",High,Done,ai,AI Features,
Story,AI matching module,"CV matching",High,Done,ai;matching;nlp-mvp,,AI Features
Story,Assistant chatbot module,"Chat UI + API",High,Done,ai;assistant;chatbot,,AI Features
Story,Interview simulation module,"Mock interviews",High,Done,ai;interview;simulation,,AI Features`
};

Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(name, content);
  console.log(`✅ Created ${name}`);
});