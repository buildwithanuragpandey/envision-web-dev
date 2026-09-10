import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for ClubFlow...');

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
      name: 'Dr. Eleanor Vance',
      email: 'admin@clubflow.local',
      passwordHash,
      role: 'ADMIN',
      department: 'Electrical Engineering & Computer Science',
      year: 'Faculty Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  // 2. Project Leads
  const lead1 = await prisma.user.create({
    data: {
      name: 'Marcus Kim',
      email: 'lead@clubflow.local',
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Robotics & Mechanical Engineering',
      year: 'Senior (4th Year)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const lead2 = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.lead@clubflow.local',
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Computer Science',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  // 3. Members
  const member1 = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'member1@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Software Engineering',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'member2@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Electrical Engineering',
      year: 'Senior (4th Year)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: 'Lucas Thorne',
      email: 'member3@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'HCI & Product Design',
      year: 'Sophomore (2nd Year)',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const member4 = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'member4@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Embedded Systems & Mechatronics',
      year: 'Sophomore (2nd Year)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const member5 = await prisma.user.create({
    data: {
      name: 'Jordan Taylor',
      email: 'member5@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'Data Science & AI',
      year: 'Freshman (1st Year)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  console.log('📁 Seeding collegiate engineering initiatives...');

  const now = new Date();
  const past45Days = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
  const past20Days = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
  const past3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const in12Days = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
  const in25Days = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Project 1: Formula SAE Electric
  const p1 = await prisma.project.create({
    data: {
      name: 'Formula SAE Electric – Telemetry & Battery Pack',
      description: 'Custom CAN-bus telemetry logging, 400V lithium cell balancing MCU firmware, and live trackside thermal analytics for 2026 competition vehicle.',
      status: 'ACTIVE',
      startDate: past45Days,
      endDate: in60Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member1.id },
          { userId: member2.id },
          { userId: member4.id },
        ],
      },
    },
  });

  // Project 2: RoboSub AUV
  const p2 = await prisma.project.create({
    data: {
      name: 'RoboSub AUV – Computer Vision & Hydrophone Localization',
      description: 'Acoustic pinger triangulation, thruster vectoring PID control, and YOLOv8 underwater gate navigation on NVIDIA Jetson Orin.',
      status: 'ACTIVE',
      startDate: past20Days,
      endDate: in25Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member1.id },
          { userId: member4.id },
          { userId: member5.id },
        ],
      },
    },
  });

  // Project 3: HackMIT / National Hackathon Portal
  const p3 = await prisma.project.create({
    data: {
      name: 'HackClub 2026 – Hacker Portal & Live Judging Queue',
      description: 'Event operations platform handling 1,200 hacker check-ins, sponsor mentorship queues, WebSocket announcements, and live rubric scoring.',
      status: 'ACTIVE',
      startDate: past20Days,
      endDate: in12Days,
      createdById: admin.id,
      projectLeadId: lead2.id,
      members: {
        create: [
          { userId: lead2.id },
          { userId: member1.id },
          { userId: member3.id },
          { userId: member5.id },
        ],
      },
    },
  });

  // Project 4: OpenSource Club Design System
  const p4 = await prisma.project.create({
    data: {
      name: 'ClubFlow Design System & Component Library v2',
      description: 'Accessible, dark-mode ready Tailwind and React component tokens utilized across 8 collegiate student software initiatives.',
      status: 'PLANNING',
      startDate: today,
      endDate: in60Days,
      createdById: admin.id,
      projectLeadId: lead2.id,
      members: {
        create: [
          { userId: lead2.id },
          { userId: member3.id },
          { userId: member5.id },
        ],
      },
    },
  });

  // Project 5: CubeSat Ground Station
  const p5 = await prisma.project.create({
    data: {
      name: 'CubeSat Ground Station – Automated UHF/VHF Tracker',
      description: 'Rotator azimuth/elevation control and Doppler frequency correction for student weather satellite downlinks.',
      status: 'COMPLETED',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
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

  console.log('📝 Seeding realistic engineering deliverables & tasks...');

  // Tasks for Project 1 (Formula SAE)
  await prisma.task.createMany({
    data: [
      {
        title: 'Calibrate CAN-bus 1Mbps baud rate on STM32F4 MCU',
        description: 'Ensure zero frame collisions under high packet traffic from motor inverter and BMS sensors.',
        projectId: p1.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: in2Days,
      },
      {
        title: 'Thermal dissipation simulation for 400V accumulator pack',
        description: 'Run COMSOL heat transfer model at continuous 80A draw through busbars.',
        projectId: p1.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in5Days,
      },
      {
        title: 'Mount driver cockpit telemetry HUD OLED display',
        description: 'Design and 3D print vibration-damped carbon-PETG steering wheel enclosure.',
        projectId: p1.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in12Days,
      },
      {
        title: 'Emergency shutdown circuit bench testing',
        description: 'Validate dual-relay inertia switch and master disconnect interlocking under fault conditions.',
        projectId: p1.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'TODO',
        deadline: past3Days, // OVERDUE
      },
      {
        title: 'Fabricate IP67 waterproof battery enclosure seal',
        description: 'Laser cut neoprene gaskets and test hermetic seal under 0.5 bar pressure test.',
        projectId: p1.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'LOW',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
    ],
  });

  // Tasks for Project 2 (RoboSub AUV)
  await prisma.task.createMany({
    data: [
      {
        title: 'Train YOLOv8 model on underwater obstacle dataset',
        description: 'Fine-tune weights on 4,000 labeled pool competition frames for buoy and torpedo target recognition.',
        projectId: p2.id,
        assignedToId: member5.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in5Days,
      },
      {
        title: 'Hydrophone acoustic pinger triangulation algorithm',
        description: 'Compute phase difference of arrival (TDOA) across 4 hydrophones at 25kHz sampling.',
        projectId: p2.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'TODO',
        deadline: in12Days,
      },
      {
        title: 'Thruster PID velocity control calibration in test tank',
        description: 'Tune yaw and surge response coefficients with IMU sensor fusion feedback.',
        projectId: p2.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
    ],
  });

  // Tasks for Project 3 (HackClub Portal)
  await prisma.task.createMany({
    data: [
      {
        title: 'Integrate Stripe registration & student deposit refunds',
        description: 'Secure webhook handling, PDF ticket issuance, and automated discount code validation.',
        projectId: p3.id,
        assignedToId: member1.id,
        createdById: lead2.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: in2Days,
      },
      {
        title: 'Build real-time mentor queue dispatch widget',
        description: 'WebSocket channel alerting volunteer mentors when teams request hardware/software debugging assistance.',
        projectId: p3.id,
        assignedToId: member5.id,
        createdById: lead2.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in5Days,
      },
      {
        title: 'Figma design tokens & responsive schedule grid',
        description: 'Craft high-contrast dark mode agenda for Keynote, AI workshops, and project expo tracks.',
        projectId: p3.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
      {
        title: 'Automate judge rubric scoring sync with Devpost',
        description: 'Export structured team scores and sponsor prize rankings into CSV and live leaderboard.',
        projectId: p3.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'LOW',
        status: 'TODO',
        deadline: in12Days,
      },
    ],
  });

  // Tasks for Project 4 (Design System)
  await prisma.task.createMany({
    data: [
      {
        title: 'Document accessible Keyboard Navigation & ARIA props',
        description: 'Provide Storybook interactive examples for modal focus traps and command palette.',
        projectId: p4.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'TODO',
        deadline: in25Days,
      },
    ],
  });

  // Tasks for Project 5 (CubeSat Ground Station Completed)
  await prisma.task.createMany({
    data: [
      {
        title: 'Calibrate Yaesu G-5500 antenna rotator controller',
        description: 'Zero azimuth calibration with compass and test 180-degree elevation tilt range.',
        projectId: p5.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past3Days,
        completedAt: past3Days,
      },
      {
        title: 'Setup automated NOAA-19 satellite image decoder pipeline',
        description: 'SDR receiver decoding APT audio into composite false-color cloud imagery.',
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
        description: 'Created initiative "Formula SAE Electric – Telemetry & Battery Pack"',
        createdAt: past45Days,
      },
      {
        userId: lead1.id,
        action: 'CREATE',
        entityType: 'TASK',
        description: 'Created task "Calibrate CAN-bus 1Mbps baud rate on STM32F4 MCU"',
        createdAt: past20Days,
      },
      {
        userId: member4.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Completed milestone "Fabricate IP67 waterproof battery enclosure seal"',
        createdAt: past3Days,
      },
      {
        userId: member3.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Published "Figma design tokens & responsive schedule grid" for HackClub',
        createdAt: past3Days,
      },
      {
        userId: member1.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Started work on "Calibrate CAN-bus 1Mbps baud rate on STM32F4 MCU"',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('\n=============================================');
  console.log('🎉 Seed completed successfully!');
  console.log('=============================================');
  console.log('Default Password for all seeded accounts: Password123!');
  console.log('---------------------------------------------');
  console.log('ADMIN:        admin@clubflow.local');
  console.log('PROJECT LEAD: lead@clubflow.local');
  console.log('PROJECT LEAD: sarah.lead@clubflow.local');
  console.log('MEMBER 1:     member1@clubflow.local');
  console.log('MEMBER 2:     member2@clubflow.local');
  console.log('MEMBER 3:     member3@clubflow.local');
  console.log('MEMBER 4:     member4@clubflow.local');
  console.log('MEMBER 5:     member5@clubflow.local');
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
