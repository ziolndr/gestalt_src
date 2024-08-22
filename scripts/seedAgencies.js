require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const agencies = [
  { name: 'Department of Defense', acronym: 'DOD' },
  { name: 'Department of Homeland Security', acronym: 'DHS' },
  { name: 'Department of State', acronym: 'DOS' },
  { name: 'Department of Justice', acronym: 'DOJ' },
  { name: 'Department of the Treasury', acronym: 'TREAS' },
  { name: 'Department of Energy', acronym: 'DOE' },
];

async function seedAgencies() {
  for (const agency of agencies) {
    await prisma.agency.upsert({
      where: { name: agency.name },
      update: {},
      create: agency,
    });
  }
  console.log('Agencies seeded successfully');
}

seedAgencies()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());