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

  console.log('👤 Seeding users...');

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Eleanor Vance',
      email: 'admin@clubflow.local',
      passwordHash,
      role: 'ADMIN',
      department: 'Computer Science & Engineering',
      year: 'Faculty Advisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  // 2. Project Leads
  const lead1 = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'lead@clubflow.local',
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Robotics & Mechatronics',
      year: 'Senior (4th Year)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const lead2 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah.lead@clubflow.local',
      passwordHash,
      role: 'PROJECT_LEAD',
      department: 'Information Systems',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
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
      department: 'Computer Science',
      year: 'Senior (4th Year)',
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
      department: 'Software Engineering',
      year: 'Junior (3rd Year)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'member3@clubflow.local',
      passwordHash,
      role: 'MEMBER',
      department: 'UI/UX & Design',
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
      department: 'Electrical Engineering',
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
      department: 'Data Science',
      year: 'Freshman (1st Year)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  console.log('📁 Seeding projects & project memberships...');

  const now = new Date();
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Project 1: Autonomous Mars Rover
  const p1 = await prisma.project.create({
    data: {
      name: 'Autonomous Mars Rover Subsystem',
      description: 'Developing navigation, computer vision obstacle detection, and chassis telemetry for the inter-collegiate robotics challenge.',
      status: 'ACTIVE',
      startDate: past30Days,
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

  // Project 2: Tech Symposium 2026 Portal
  const p2 = await prisma.project.create({
    data: {
      name: 'Tech Symposium 2026 Web Platform',
      description: 'Full-stack registration, live schedule streaming, speaker interaction, and ticketing portal for the annual national conference.',
      status: 'ACTIVE',
      startDate: past30Days,
      endDate: in30Days,
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

  // Project 3: AI Open Source Research Hub
  const p3 = await prisma.project.create({
    data: {
      name: 'AI Open Source Research Hub',
      description: 'Distributed model benchmarking and evaluation tooling for student research papers and open datasets.',
      status: 'PLANNING',
      startDate: today,
      endDate: in60Days,
      createdById: admin.id,
      projectLeadId: lead1.id,
      members: {
        create: [
          { userId: lead1.id },
          { userId: member1.id },
          { userId: member3.id },
        ],
      },
    },
  });

  // Project 4: ClubFlow Mobile Companion App v1
  const p4 = await prisma.project.create({
    data: {
      name: 'ClubFlow Mobile Companion v1.0',
      description: 'Cross-platform mobile client for student push notifications, check-ins, and meeting minutes.',
      status: 'COMPLETED',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: past5Days,
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

  console.log('📝 Seeding realistic tasks with statuses & deadlines...');

  // Tasks for Project 1 (Rover)
  await prisma.task.createMany({
    data: [
      {
        title: 'Calibrate LiDAR & Ultrasonic Sensors',
        description: 'Run precision benchmarks across 5m grid with static and dynamic obstacle sets.',
        projectId: p1.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: today,
      },
      {
        title: 'Implement Path Planning A* Algorithm',
        description: 'Optimize Euclidean heuristic computation on the embedded Jetson Nano board.',
        projectId: p1.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        deadline: in3Days,
      },
      {
        title: 'Chassis Power Distribution Firmware',
        description: 'Write fail-safe battery cutoff and 24V step-down regulator monitoring routines.',
        projectId: p1.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in7Days,
      },
      {
        title: '3D Print Motor Mount Brackets',
        description: 'Fabricate carbon-fiber reinforced PETG brackets for high-torque planetary gearboxes.',
        projectId: p1.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'LOW',
        status: 'COMPLETED',
        deadline: past5Days,
        completedAt: past5Days,
      },
      {
        title: 'Setup ROS2 Telemetry Node',
        description: 'Publish topic streaming for GPS coordinates and IMU attitude data at 50Hz.',
        projectId: p1.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past5Days,
        completedAt: past5Days,
      },
      {
        title: 'Emergency Brake Protocol Validation',
        description: 'Conduct zero-speed drop safety test under maximum load conditions.',
        projectId: p1.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'URGENT',
        status: 'TODO',
        deadline: past5Days, // OVERDUE TASK
      },
    ],
  });

  // Tasks for Project 2 (Symposium Web Platform)
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Dark Mode Speaker Schedule Grid',
        description: 'High-fidelity Figma wireframes and responsive Tailwind components for tracks A, B, and C.',
        projectId: p2.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past5Days,
        completedAt: past5Days,
      },
      {
        title: 'Integrate Stripe Payment Gateway',
        description: 'Webhook verification, checkout sessions, student discount validation, and PDF receipts.',
        projectId: p2.id,
        assignedToId: member1.id,
        createdById: lead2.id,
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        deadline: in3Days,
      },
      {
        title: 'Build Live Q&A Voting Widget',
        description: 'Real-time WebSocket connection allowing attendees to upvote speaker questions.',
        projectId: p2.id,
        assignedToId: member5.id,
        createdById: lead2.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in14Days,
      },
      {
        title: 'Automate Speaker Confirmation Emails',
        description: 'Email queue system sending calendar invites, hotel vouchers, and technical checklists.',
        projectId: p2.id,
        assignedToId: member3.id,
        createdById: lead2.id,
        priority: 'LOW',
        status: 'TODO',
        deadline: in7Days,
      },
    ],
  });

  // Tasks for Project 3 (AI Research Hub)
  await prisma.task.createMany({
    data: [
      {
        title: 'Benchmark HuggingFace Transformers on Apple Silicon',
        description: 'Collect latency, memory footprint, and token/sec throughput using Metal Performance Shaders.',
        projectId: p3.id,
        assignedToId: member1.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'TODO',
        deadline: in14Days,
      },
      {
        title: 'Draft Literature Review on Speculative Decoding',
        description: 'Synthesize findings from recent NeurIPS/ICLR publications into club knowledge base.',
        projectId: p3.id,
        assignedToId: member3.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'TODO',
        deadline: in30Days,
      },
    ],
  });

  // Tasks for Project 4 (Mobile App Completed)
  await prisma.task.createMany({
    data: [
      {
        title: 'App Store & Google Play Submission',
        description: 'Complete privacy policy disclosures, screenshots, and compliance review.',
        projectId: p4.id,
        assignedToId: member2.id,
        createdById: lead1.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        deadline: past5Days,
        completedAt: past5Days,
      },
      {
        title: 'Push Notification Backend Integration',
        description: 'Configure Firebase Cloud Messaging triggers for urgent club announcements.',
        projectId: p4.id,
        assignedToId: member4.id,
        createdById: lead1.id,
        priority: 'MEDIUM',
        status: 'COMPLETED',
        deadline: past5Days,
        completedAt: past5Days,
      },
    ],
  });

  console.log('📊 Seeding activity logs...');
  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'CREATE',
        entityType: 'PROJECT',
        entityId: p1.id,
        description: 'Created new project "Autonomous Mars Rover Subsystem"',
        createdAt: past30Days,
      },
      {
        userId: admin.id,
        action: 'ASSIGN',
        entityType: 'PROJECT',
        entityId: p1.id,
        description: 'Assigned David Kim as Project Lead for "Autonomous Mars Rover Subsystem"',
        createdAt: past30Days,
      },
      {
        userId: lead1.id,
        action: 'MEMBER_ADD',
        entityType: 'PROJECT',
        entityId: p1.id,
        description: 'Added Alex Rivera, Priya Sharma, and Elena Rostova to Mars Rover team',
        createdAt: past30Days,
      },
      {
        userId: lead2.id,
        action: 'CREATE',
        entityType: 'TASK',
        description: 'Created task "Integrate Stripe Payment Gateway" for Tech Symposium',
        createdAt: past5Days,
      },
      {
        userId: member3.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Completed task "Design Dark Mode Speaker Schedule Grid"',
        createdAt: past5Days,
      },
      {
        userId: member4.id,
        action: 'STATUS_CHANGE',
        entityType: 'TASK',
        description: 'Completed task "3D Print Motor Mount Brackets"',
        createdAt: past5Days,
      },
      {
        userId: admin.id,
        action: 'CREATE',
        entityType: 'USER',
        entityId: member5.id,
        description: 'Created member account for Jordan Taylor (MEMBER)',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
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
