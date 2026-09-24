import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  User, Organization, OrganizationMember, Team, TeamMember, Project, ProjectMember,
  Epic, Requirement, UserStory, Sprint, Task, TaskDependency, Issue, Comment, Milestone,
  Notification, ActivityLog, DefinitionOfDone, DefinitionOfDoneItem, TestCase, RequirementTrace
} from '../models';
import { Role, TaskStatus, Priority, IssueSeverity, SprintStatus, DependencyType, ActivityAction } from '@projectpulse/shared';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projectpulse';

const seed = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Drop all collections safely
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.collections();
      for (let collection of collections) {
        await collection.deleteMany({});
      }
      console.log('Cleared existing data.');
    }

    // 1. Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const orgAdmin = await User.create({ firstName: 'Alice', lastName: 'Admin', email: 'alice@example.com', passwordHash });
    const projManager = await User.create({ firstName: 'Bob', lastName: 'Manager', email: 'bob@example.com', passwordHash });
    const teamLead = await User.create({ firstName: 'Charlie', lastName: 'Lead', email: 'charlie@example.com', passwordHash });
    const dev1 = await User.create({ firstName: 'Dave', lastName: 'Dev', email: 'dave@example.com', passwordHash });
    const dev2 = await User.create({ firstName: 'Eve', lastName: 'Dev', email: 'eve@example.com', passwordHash });

    // 2. Organization & Members
    const org = await Organization.create({ name: 'Acme Corp', slug: 'acme', ownerId: orgAdmin._id });
    
    await OrganizationMember.create([
      { organizationId: org._id, userId: orgAdmin._id, role: Role.ORG_ADMIN },
      { organizationId: org._id, userId: projManager._id, role: Role.PROJECT_MANAGER },
      { organizationId: org._id, userId: teamLead._id, role: Role.TEAM_LEAD },
      { organizationId: org._id, userId: dev1._id, role: Role.DEVELOPER },
      { organizationId: org._id, userId: dev2._id, role: Role.DEVELOPER },
    ]);

    // 3. Team & Members
    const backendTeam = await Team.create({ organizationId: org._id, name: 'Backend Services', description: 'Core API team' });
    
    await TeamMember.create([
      { teamId: backendTeam._id, userId: teamLead._id },
      { teamId: backendTeam._id, userId: dev1._id },
      { teamId: backendTeam._id, userId: dev2._id },
    ]);

    // 4. Project & Members
    const project = await Project.create({ 
      organizationId: org._id, 
      name: 'ProjectPulse V1', 
      key: 'PULSE', 
      leadId: projManager._id,
      description: 'The core platform MVP'
    });

    await ProjectMember.create([
      { projectId: project._id, userId: projManager._id, role: Role.PROJECT_MANAGER },
      { projectId: project._id, userId: teamLead._id, role: Role.TEAM_LEAD },
      { projectId: project._id, userId: dev1._id, role: Role.DEVELOPER },
      { projectId: project._id, userId: dev2._id, role: Role.DEVELOPER },
    ]);

    // 5. Requirements & Epics & User Stories
    const req1 = await Requirement.create({
      organizationId: org._id, projectId: project._id, key: 'REQ-001',
      title: 'Adaptive Delivery Engine Base', description: 'System should detect scope creep and drift.'
    });

    const epic1 = await Epic.create({
      organizationId: org._id, projectId: project._id, requirementId: req1._id,
      title: 'Drift Detection Engine', description: 'Track baseline vs current sprint state'
    });

    const story1 = await UserStory.create({
      organizationId: org._id, projectId: project._id, epicId: epic1._id,
      title: 'Calculate scope increase in sprint', storyPoints: 5,
      acceptanceCriteria: 'Given a sprint is active, when a task is added, then the scope increase should be visible.'
    });

    await RequirementTrace.create([
      { sourceType: 'Requirement', sourceId: req1._id, targetType: 'Epic', targetId: epic1._id },
      { sourceType: 'Epic', sourceId: epic1._id, targetType: 'UserStory', targetId: story1._id },
    ]);

    // 6. Sprint (Demonstrating Adaptive Delivery Engine context)
    const sprint = await Sprint.create({
      projectId: project._id, name: 'Sprint 1', goal: 'Launch MVP',
      status: SprintStatus.ACTIVE,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
      plannedStoryPoints: 15,
      completedStoryPoints: 3, // Drift / variance
    });

    // 7. Definition of Done
    const dod = await DefinitionOfDone.create({
      organizationId: org._id, projectId: project._id, name: 'Standard Backend DoD',
      rules: [
        { description: 'Code Review Approved', isRequired: true },
        { description: 'Unit Tests Passed', isRequired: true },
      ]
    });
    const dodRuleId = (dod.rules[0] as any)._id;

    // 8. Tasks (creating scenarios for Drift/Health engines)
    // Task 1: Completed task
    const task1 = await Task.create({
      organizationId: org._id, projectId: project._id, sprintId: sprint._id,
      key: 'PULSE-1', title: 'Setup Repo', status: TaskStatus.DONE, priority: Priority.HIGH,
      storyPoints: 3, reporterId: projManager._id, assigneeId: dev1._id, userStoryId: story1._id
    });

    // Task 2: Blocked task
    const task2 = await Task.create({
      organizationId: org._id, projectId: project._id, sprintId: sprint._id,
      key: 'PULSE-2', title: 'Implement Sprint Baseline', status: TaskStatus.IN_PROGRESS, priority: Priority.URGENT,
      storyPoints: 5, reporterId: projManager._id, assigneeId: dev2._id, userStoryId: story1._id,
      isBlocked: true
    });

    // Task 3: Added after sprint start (Scope Creep)
    const task3 = await Task.create({
      organizationId: org._id, projectId: project._id, sprintId: sprint._id,
      key: 'PULSE-3', title: 'Fix Auth Bug', status: TaskStatus.TODO, priority: Priority.HIGH,
      storyPoints: 2, reporterId: dev1._id, assigneeId: dev1._id
    });
    // Simulating it was created just now, unlike sprint started 3 days ago

    // 9. Task Dependencies
    await TaskDependency.create([
      { sourceTaskId: task3._id, targetTaskId: task2._id, type: DependencyType.BLOCKS }
    ]);

    // 10. DoD Items
    await DefinitionOfDoneItem.create([
      { taskId: task1._id, dodId: dod._id, ruleId: dodRuleId, isCompleted: true, completedBy: teamLead._id, completedAt: new Date() },
      { taskId: task2._id, dodId: dod._id, ruleId: dodRuleId, isCompleted: false },
    ]);

    // 11. Issues
    const issue1 = await Issue.create({
      organizationId: org._id, projectId: project._id, taskId: task2._id,
      key: 'ISSUE-1', title: 'Baseline snapshot fails on concurrent writes',
      description: 'Race condition during sprint start', severity: IssueSeverity.HIGH,
      status: TaskStatus.TODO, reporterId: dev2._id
    });

    // 12. Activity Logs
    await ActivityLog.create([
      { organizationId: org._id, projectId: project._id, actorId: projManager._id, action: ActivityAction.SPRINT_STARTED, entityType: 'Sprint', entityId: sprint._id },
      { organizationId: org._id, projectId: project._id, actorId: dev1._id, action: ActivityAction.CREATED, entityType: 'Task', entityId: task3._id, metadata: { note: 'Scope added post-sprint-start' } }
    ]);

    // 13. Milestone
    await Milestone.create({
      organizationId: org._id, projectId: project._id, name: 'MVP Beta',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'ON_TRACK'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
