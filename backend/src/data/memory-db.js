const seededJobs = [
  {
    id: 1,
    recruiterId: 0,
    title: 'Junior Frontend Engineer',
    company: 'NovaTech Labs',
    location: 'Remote - Europe',
    employmentType: 'full-time',
    salaryRange: 'EUR 40k - 55k',
    description: 'Build modern web interfaces with Angular and TypeScript.',
    requiredSkills: ['angular', 'typescript', 'css'],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    recruiterId: 0,
    title: 'Data Analyst Graduate Program',
    company: 'Northwind Insights',
    location: 'Paris, France',
    employmentType: 'full-time',
    salaryRange: 'EUR 38k - 48k',
    description: 'Analyze dashboards and business data to support growth teams.',
    requiredSkills: ['sql', 'excel', 'python'],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    recruiterId: 0,
    title: 'Product Designer Intern',
    company: 'Pulse AI',
    location: 'Berlin, Germany',
    employmentType: 'internship',
    salaryRange: 'EUR 1.3k / month',
    description: 'Design UI flows and contribute to component libraries.',
    requiredSkills: ['figma', 'design systems', 'ui'],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const memoryDb = {
  users: [],
  candidateProfiles: [],
  jobs: seededJobs,
  applications: [],
  chatSessions: [],
  chatMessages: [],
  interviewSessions: [],
  sequences: {
    users: 1,
    candidateProfiles: 1,
    jobs: 4,
    applications: 1,
    chatSessions: 1,
    chatMessages: 1,
    interviewSessions: 1
  }
};

function nextId(tableName) {
  const current = memoryDb.sequences[tableName];
  memoryDb.sequences[tableName] += 1;
  return current;
}

module.exports = {
  memoryDb,
  nextId
};
