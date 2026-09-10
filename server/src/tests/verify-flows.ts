const API_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting Comprehensive E2E Flow & RBAC Verification...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, extra?: any) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`, extra || '');
      failed++;
    }
  };

  try {
    // Helper fetch wrapper
    const req = async (path: string, options: any = {}): Promise<{ status: number; data: any }> => {
      const url = `${API_URL}${path}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      const data: any = await res.json().catch(() => null);
      return { status: res.status, data };
    };

    // ----------------------------------------------------
    // FLOW 1: Admin Operations & Team Formation
    // ----------------------------------------------------
    console.log('--- FLOW 1: Admin Operations & Team Formation ---');
    const adminLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@clubflow.local',
        password: 'Password123!',
      }),
    });
    assert(adminLogin.status === 200 && adminLogin.data.data.user.role === 'ADMIN', 'Admin login successful');
    const adminToken = adminLogin.data.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    const adminDash = await req('/dashboard/admin', { headers: adminHeaders });
    assert(adminDash.status === 200 && adminDash.data.data.kpis.totalProjects > 0, 'Admin Dashboard metrics loaded');

    // Get a Project Lead user ID
    const usersRes = await req('/users', { headers: adminHeaders });
    const leadUser = usersRes.data.data.find((u: any) => u.role === 'PROJECT_LEAD');
    const memberUsers = usersRes.data.data.filter((u: any) => u.role === 'MEMBER');
    assert(!!leadUser && memberUsers.length >= 2, 'Found lead and member accounts for assignment');

    // Create a new project as Admin
    const createProject = await req('/projects', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Autonomous Drone Flight Controller',
        description: 'Flight stabilization and computer vision altitude tracking for indoor flight arena.',
        status: 'ACTIVE',
        projectLeadId: leadUser.id,
        memberIds: [memberUsers[0].id],
      }),
    });
    assert(createProject.status === 201 && createProject.data.data.name === 'Autonomous Drone Flight Controller', 'Admin created project');
    const newProjectId = createProject.data.data.id;

    // Add another member to project
    const addMember = await req(`/projects/${newProjectId}/members`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ userId: memberUsers[1].id }),
    });
    assert(addMember.status === 200, 'Admin added second member to project team');

    // Verify project detail contains team
    const projectDetail = await req(`/projects/${newProjectId}`, { headers: adminHeaders });
    assert(
      projectDetail.data.data.members.length === 3 &&
      projectDetail.data.data.projectLeadId === leadUser.id,
      'Project details accurately reflect assigned Project Lead and 3 members'
    );

    // ----------------------------------------------------
    // FLOW 2: Project Lead Task Creation & Assignment
    // ----------------------------------------------------
    console.log('\n--- FLOW 2: Project Lead Task Creation & Assignment ---');
    const leadLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: leadUser.email,
        password: 'Password123!',
      }),
    });
    assert(leadLogin.status === 200 && leadLogin.data.data.user.role === 'PROJECT_LEAD', 'Project Lead login successful');
    const leadToken = leadLogin.data.data.token;
    const leadHeaders = { Authorization: `Bearer ${leadToken}` };

    const leadDash = await req('/dashboard/lead', { headers: leadHeaders });
    assert(leadDash.status === 200 && leadDash.data.data.projectSummaries.length > 0, 'Project Lead Dashboard loaded');

    // Create task inside new project
    const createTask = await req('/tasks', {
      method: 'POST',
      headers: leadHeaders,
      body: JSON.stringify({
        title: 'Calibrate Gyroscope & Accelerometer PID loops',
        description: 'Run 1000Hz sampling cycle test on STM32 flight MCU.',
        projectId: newProjectId,
        assignedToId: memberUsers[0].id,
        priority: 'URGENT',
        status: 'TODO',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
    assert(createTask.status === 201 && createTask.data.data.status === 'TODO', 'Project Lead created and assigned task to member');
    const newTaskId = createTask.data.data.id;

    // ----------------------------------------------------
    // FLOW 3: Member Status Progression (TODO -> IN_PROGRESS -> COMPLETED)
    // ----------------------------------------------------
    console.log('\n--- FLOW 3: Member Status Progression (TODO -> IN_PROGRESS -> COMPLETED) ---');
    const memberLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: memberUsers[0].email,
        password: 'Password123!',
      }),
    });
    assert(memberLogin.status === 200 && memberLogin.data.data.user.role === 'MEMBER', 'Member login successful');
    const memberToken = memberLogin.data.data.token;
    const memberHeaders = { Authorization: `Bearer ${memberToken}` };

    // Move to IN_PROGRESS
    const moveInProg = await req(`/tasks/${newTaskId}/status`, {
      method: 'PATCH',
      headers: memberHeaders,
      body: JSON.stringify({ status: 'IN_PROGRESS' }),
    });
    assert(moveInProg.status === 200 && moveInProg.data.data.status === 'IN_PROGRESS', 'Member transitioned task to IN_PROGRESS');

    // Move to COMPLETED
    const moveCompleted = await req(`/tasks/${newTaskId}/status`, {
      method: 'PATCH',
      headers: memberHeaders,
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    assert(
      moveCompleted.status === 200 &&
      moveCompleted.data.data.status === 'COMPLETED' &&
      !!moveCompleted.data.data.completedAt,
      'Member transitioned task to COMPLETED with timestamp'
    );

    // ----------------------------------------------------
    // FLOW 4: Real Progress Calculation Verification
    // ----------------------------------------------------
    console.log('\n--- FLOW 4: Real Progress Calculation Verification ---');
    const updatedProject = await req(`/projects/${newProjectId}`, { headers: adminHeaders });
    assert(
      updatedProject.data.data.completedTasks === 1 &&
      updatedProject.data.data.totalTasks === 1 &&
      updatedProject.data.data.progress === 100,
      'Project progress dynamically computed as 100% based on task completions'
    );

    // ----------------------------------------------------
    // FLOW 5: Multi-Project Membership Verification
    // ----------------------------------------------------
    console.log('\n--- FLOW 5: Multi-Project Membership Verification ---');
    const memberDash = await req('/dashboard/member', { headers: memberHeaders });
    assert(
      memberDash.status === 200 && memberDash.data.data.projects.length >= 2,
      `Member belongs to multiple projects (${memberDash.data.data.projects.length} projects visible on dashboard)`
    );

    // ----------------------------------------------------
    // FLOW 6: RBAC Member Forbidden Boundary Enforcement
    // ----------------------------------------------------
    console.log('\n--- FLOW 6: RBAC Member Forbidden Boundary Enforcement ---');
    const adminDashForbidden = await req('/dashboard/admin', { headers: memberHeaders });
    assert(adminDashForbidden.status === 403, 'Member accessing Admin Dashboard blocked with 403 Forbidden');

    const createProjectForbidden = await req('/projects', {
      method: 'POST',
      headers: memberHeaders,
      body: JSON.stringify({ name: 'Unauthorized Project' }),
    });
    assert(createProjectForbidden.status === 403, 'Member creating project blocked with 403 Forbidden');

    // ----------------------------------------------------
    // FLOW 7: Project Lead Cross-Project Modification Protection
    // ----------------------------------------------------
    console.log('\n--- FLOW 7: Project Lead Cross-Project Modification Protection ---');
    const allProjects = await req('/projects', { headers: adminHeaders });
    const otherLeadProject = allProjects.data.data.find((p: any) => p.projectLeadId !== leadUser.id);
    
    if (otherLeadProject) {
      const crossTask = await req('/tasks', {
        method: 'POST',
        headers: leadHeaders,
        body: JSON.stringify({
          title: 'Unauthorized Task In Another Lead Project',
          projectId: otherLeadProject.id,
        }),
      });
      assert(crossTask.status === 403, 'Lead creating task in unrelated project blocked with 403 Forbidden');
    }

    // ----------------------------------------------------
    // FLOW 8: Unauthenticated Access Protection
    // ----------------------------------------------------
    console.log('\n--- FLOW 8: Unauthenticated Access Protection ---');
    const unauthMe = await req('/auth/me');
    assert(unauthMe.status === 401, 'Unauthenticated request rejected with 401 Unauthorized');

    console.log('\n=============================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
