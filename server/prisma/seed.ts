import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for ClubFlow (Authentic College Club Data)...');

  // Clean existing tables in correct order
  await prisma.activityLog.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = 'Password123!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  console.log('👤 Seeding authentic club members and leadership...');

  // 1. Admin (Faculty Advisor)
  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Sharma',
      email: 'admin@clubflow.local',
      passwordHash,
      role: 'ADMIN',
      department: 'Computer Science & Engineering',
      year: 'Faculty Advisor',
      avatar: '',
      isActive: true,
    },
  });

  // 2. Project Leads
  const lead1 = await prisma.user.create({
    data: {
      name: 'Anurag Pandey',
      email: 'lead@clubflow.local',
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Computer Science & Engineering',
      year: '3rd Year (Junior)',
      avatar: '',
      isActive: true,
    },
  });

  const lead2 = await prisma.user.create({
    data: {
      name: 'Aditya Verma',
      email: 'sarah.lead@clubflow.local', // mapped for existing test & login compatibility
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Information Technology',
      year: '3rd Year (Junior)',
      avatar: '',
      isActive: true,
    },
  });

  // 3. Members
  const member1 = await prisma.user.create({
    data: {
      name: 'Rohit Gupta',
      email: 'member1@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Computer Science & Engineering',
      year: '2nd Year (Sophomore)',
      avatar: '',
      isActive: true,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      email: 'member2@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Electronics & Communication',
      year: '3rd Year (Junior)',
      avatar: '',
      isActive: true,
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: 'Arjun Nair',
      email: 'member3@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Design & Human-Computer Interaction',
      year: '2nd Year (Sophomore)',
      avatar: '',
      isActive: true,
    },
  });

  const member4 = await prisma.user.create({
    data: {
      name: 'Ananya Deshmukh',
      email: 'member4@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Computer Science & Engineering',
      year: '2nd Year (Sophomore)',
      avatar: '',
      isActive: true,
    },
  });

  const member5 = await prisma.user.create({
    data: {
      name: 'Harsh Vardhan',
      email: 'member5@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Data Science & Analytics',
      year: '1st Year (Freshman)',
      avatar: '',
      isActive: true,
    },
  });

  const member6 = await prisma.user.create({
    data: {
      name: 'Priya Iyer',
      email: 'priya@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Electrical & Electronics',
      year: '3rd Year (Junior)',
      avatar: '',
      isActive: true,
    },
  });

  console.log('📁 Seeding realistic college club projects...');

  const now = new Date();
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const past15Days = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const past3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const in28Days = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Project 1: HackFest 2026
  const p1 = await prisma.project.create({
    data: {
      name: 'HackFest 2026 – Hackathon Operations & Event Portal',
      description: 'Annual 36-hour collegiate hackathon operations covering participant registration, sponsor problem statements, mentor queue, and live judging portal.',
      status: 'ACTIVE',
      startDate: past30Days,
      endDate: in28Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member1.id },
          { userId: member2.id },
          { userId: member3.id },
          { userId: member4.id },
        ],
      },
    },
  });

  // Project 2: Club Website Redesign
  const p2 = await prisma.project.create({
    data: {
      name: 'Official Club Website Redesign & CMS Portal',
      description: 'Redesigning the technical club primary web presence, including event archives, team directory, project showcase, and recruitment application portal.',
      status: 'ACTIVE',
      startDate: past15Days,
      endDate: in14Days,
      createdById: admin.id,
      projectLeadId: lead2.id,
      members: {
        create: [
          { userId: lead2.id },
          { userId: member1.id },
          { userId: member3.id },
          { userId: member4.id },
        ],
      },
    },
  });

  // Project 3: Web Dev Bootcamp
  const p3 = await prisma.project.create({
    data: {
      name: 'Web Development & Cloud Bootcamp 2026',
      description: 'Hands-on 4-week workshop series covering React, Tailwind CSS, Node.js, REST APIs, and cloud deployments for 150+ enrolled club freshmen.',
      status: 'ACTIVE',
      startDate: past15Days,
      endDate: in14Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member1.id },
          { userId: member5.id },
          { userId: member6.id },
        ],
      },
    },
  });

  // Project 4: Annual Tech Fest
  const p4 = await prisma.project.create({
    data: {
      name: 'Annual Technical Fest – Project Expo & Keynote Tracks',
      description: 'Inter-college technical symposium coordination including project exhibition curation, stage A/V setup, guest speaker logistics, and merchandise.',
      status: 'PLANNING',
      startDate: today,
      endDate: in60Days,
      createdById: admin.id,
      projectLeadId: lead2.id,
      members: {
        create: [
          { userId: lead2.id },
          { userId: member2.id },
          { userId: member5.id },
        ],
      },
    },
  });

  // Project 5: Open Source Workshop Series (Completed)
  const p5 = await prisma.project.create({
    data: {
      name: 'Git, GitHub & Open Source Contribution Sprint',
      description: 'Weekend sprint sessions teaching version control best practices and guiding members through their first open source contributions.',
      status: 'COMPLETED',
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: past3Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member2.id },
          { userId: member4.id },
        ],
      },
    },
  });

  console.log('📝 Seeding realistic club tasks & deliverables...');

  // Tasks for Project 1 (HackFest 2026)
  await prisma.task.createMany({
    data: [
      {
        title: 'Build event registration form & QR ticket generator',
        description: 'Create responsive Next.js registration view with student ID validation and automated ticket PDF generation with QR check-in codes.',
        projectId: p1.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: in2Days,
      },
      {
        title: 'Coordinate venue Wi-Fi & backup power with college admin',
        description: 'Submit formal request for 500Mbps dedicated auditorium uplink and 20 power extension distribution boxes.',
        projectId: p1.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'TODO',
        deadline: past3Days, // OVERDUE
      },
      {
        title: 'Design event badges, sticker packs & sponsor banners',
        description: 'Figma mockups for 300 participant lanyards, mentor badges, and 6x4 sponsor podium backdrops.',
        projectId: p1.id,
        assignedToId: member3.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
      {
        title: 'Set up real-time mentor queue dispatch on WebSocket',
        description: 'Live queue interface allowing hacker teams to request debugging assistance across Web, AI/ML, and Mobile tracks.',
        projectId: p1.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in6Days,
      },
      {
        title: 'Finalize judging criteria & rubric scoring sync',
        description: 'Publish 5-tier evaluation criteria (Innovation, Technical Depth, UI/UX, Presentation, Feasibility) for judges.',
        projectId: p1.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in14Days,
      },
    ],
  });

  // Tasks for Project 2 (Club Website Redesign)
  await prisma.task.createMany({
    data: [
      {
        title: 'Implement accessible dark mode theme tokens & navigation',
        description: 'Refactor Tailwind color palette with Geist font hierarchy and mobile slide-out navigation menu.',
        projectId: p2.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in6Days,
      },
      {
        title: 'Build member directory with search and department filter',
        description: 'Client-side instant filtering across academic years, sub-teams, and project contribution tags.',
        projectId: p2.id,
        assignedToId: member1.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in2Days,
      },
      {
        title: 'Set up MDX blog engine for student project writeups',
        description: 'Syntax highlighting with Prism, frontmatter parsing, reading time calculation, and RSS feed.',
        projectId: p2.id,
        assignedToId: member4.id,
        createdById: lead2.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in14Days,
      },
    ],
  });

  // Tasks for Project 3 (Web Dev Bootcamp)
  await prisma.task.createMany({
    data: [
      {
        title: 'Prepare hands-on slide deck for Session 2: REST APIs & Express',
        description: 'Create interactive code sandbox examples for routing, middleware, and CRUD endpoints.',
        projectId: p3.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: in2Days,
      },
      {
        title: 'Configure automated attendance bot on club Discord server',
        description: 'Discord slash command logging attendee check-in timestamps to Google Sheets.',
        projectId: p3.id,
        assignedToId: member5.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in6Days,
      },
      {
        title: 'Publish starter template repo for frontend assignment 1',
        description: 'Vite + React + Tailwind starter repository with step-by-step README instructions.',
        projectId: p3.id,
        assignedToId: member6.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
    ],
  });

  // Tasks for Project 4 (Annual Tech Fest)
  await prisma.task.createMany({
    data: [
      {
        title: 'Draft guest speaker invitation & travel coordination packet',
        description: 'Official invitation letter, honorarium policy, and accommodation booking for 4 industry keynote speakers.',
        projectId: p4.id,
        assignedToId: member2.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'TODO',
        deadline: in28Days,
      },
      {
        title: 'Curate project expo floor plan & booth allocation map',
        description: 'Allocate 35 hardware & software exhibition tables in the college main convention hall.',
        projectId: p4.id,
        assignedToId: member5.id,
        createdById: lead2.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in28Days,
      },
    ],
  });

  // Tasks for Project 5 (Git Workshop - Completed)
  await prisma.task.createMany({
    data: [
      {
        title: 'Publish Git practice repository with merge conflict drills',
        description: 'Interactive CLI exercises demonstrating cherry-pick, rebase, and conflict resolution.',
        projectId: p5.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
      {
        title: 'Record & edit workshop session video for YouTube archive',
        description: 'Add chapter timestamps, audio compression, and slide overlay cuts for the club channel.',
        projectId: p5.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
    ],
  });

  console.log('📊 Seeding authentic activity logs...');
  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'CREATE',
        entityType: 'PROJECT',
        entityId: p1.id,
        description: 'Created initiative "HackFest 2026 – Hackathon Operations & Event Portal"',
        createdAt: past30Days,
      },
      {
        userId: lead1.id,
        action: 'CREATE',
        entityType: 'TASK',
        description: 'Assigned "Build event registration form & QR ticket generator" to Rohit Gupta',
        createdAt: past15Days,
      },
      {
        userId: member3.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Completed "Design event badges, sticker packs & sponsor banners"',
        createdAt: past3Days,
      },
      {
        userId: lead2.id,
        action: 'CREATE',
        entityType: 'PROJECT',
        entityId: p2.id,
        description: 'Created initiative "Official Club Website Redesign & CMS Portal"',
        createdAt: past15Days,
      },
      {
        userId: member1.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Moved "Prepare hands-on slide deck for Session 2: REST APIs & Express" to In Progress',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('\n=============================================');
  console.log('🎉 Seed completed successfully with authentic college club data!');
  console.log('=============================================');
  console.log('Default Password for all seeded accounts: Password123!');
  console.log('---------------------------------------------');
  console.log('ADMIN:        admin@clubflow.local (Dr. Rajesh Sharma)');
  console.log('PROJECT LEAD: lead@clubflow.local (Anurag Pandey)');
  console.log('PROJECT LEAD: sarah.lead@clubflow.local (Aditya Verma)');
  console.log('MEMBER 1:     member1@clubflow.local (Rohit Gupta)');
  console.log('MEMBER 2:     member2@clubflow.local (Sneha Patel)');
  console.log('MEMBER 3:     member3@clubflow.local (Arjun Nair)');
  console.log('MEMBER 4:     member4@clubflow.local (Ananya Deshmukh)');
  console.log('MEMBER 5:     member5@clubflow.local (Harsh Vardhan)');
  console.log('=============================================\n');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
