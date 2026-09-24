import { qualityService } from './quality.service';
import { Issue, TestCase, RequirementTrace } from '../models';
import { IssueSeverity, TaskStatus } from '@projectpulse/shared';
import mongoose from 'mongoose';

describe('Quality Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Issues', () => {
    it('should create an issue', async () => {
      Issue.countDocuments = jest.fn().mockResolvedValue(0);
      Issue.create = jest.fn().mockResolvedValue({ _id: 'issue1', key: 'BUG-1' });

      const issue = await qualityService.createIssue('org1', 'proj1', 'Bug title', IssueSeverity.HIGH);
      expect(Issue.create).toHaveBeenCalledWith(expect.objectContaining({
        key: 'BUG-1',
        title: 'Bug title',
        severity: IssueSeverity.HIGH
      }));
      expect(issue).toBeDefined();
    });

    it('should trace issue to requirement if reqId provided', async () => {
      Issue.countDocuments = jest.fn().mockResolvedValue(0);
      Issue.create = jest.fn().mockResolvedValue({ _id: 'issue1' });
      RequirementTrace.create = jest.fn().mockResolvedValue({});

      await qualityService.createIssue('org1', 'proj1', 'Bug', IssueSeverity.LOW, 'Desc', undefined, undefined, 'req1');
      expect(RequirementTrace.create).toHaveBeenCalled();
    });

    it('should update issue status', async () => {
      const mockIssue = { _id: 'issue1', status: TaskStatus.TODO, save: jest.fn() };
      Issue.findById = jest.fn().mockResolvedValue(mockIssue);

      await qualityService.updateIssueStatus('issue1', TaskStatus.IN_PROGRESS);
      expect(mockIssue.status).toBe(TaskStatus.IN_PROGRESS);
      expect(mockIssue.save).toHaveBeenCalled();
    });
  });

  describe('Test Cases', () => {
    it('should create a test case', async () => {
      TestCase.create = jest.fn().mockResolvedValue({ _id: 'tc1' });
      const tc = await qualityService.createTestCase('org1', 'proj1', 'req1', 'Test login', '1. open app', 'success');
      expect(TestCase.create).toHaveBeenCalled();
      expect(tc).toBeDefined();
    });

    it('should execute a test case', async () => {
      const mockTC = { _id: 'tc1', status: 'DRAFT', save: jest.fn() };
      TestCase.findById = jest.fn().mockResolvedValue(mockTC);

      await qualityService.executeTestCase('tc1', 'FAILED', 'got 500 error');
      expect(mockTC.status).toBe('FAILED');
      expect(mockTC.save).toHaveBeenCalled();
    });
  });
});
