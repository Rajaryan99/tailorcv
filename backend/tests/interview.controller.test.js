import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import interviewController, { getUploadedResume } from '../controllers/interview.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import blacklistModel from '../models/blacklist.model.js';
import interviewReportModel from '../models/interviewReport.model.js';

test('getUploadedResume accepts a file uploaded under the legacy file field name', () => {
  const uploadedFile = { originalname: 'resume.pdf', buffer: Buffer.from('pdf') };
  const req = { files: { file: [uploadedFile] } };

  assert.equal(getUploadedResume(req), uploadedFile);
});

test('generateInterviewReportController rejects a request with no text input or upload with a 400 response', async () => {
  const req = {
    body: {
      jobDescription: 'Build apps'
    }
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };

  await interviewController.generateInterviewReportController(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Self description and job description are required');
});

test('authUser rejects expired JWT tokens with a 401 response', async () => {
  const previousSecret = process.env.JWT_SECRET;
  const previousBlacklist = blacklistModel.findOne;
  process.env.JWT_SECRET = 'test-secret';
  blacklistModel.findOne = async () => null;

  const expiredToken = jwt.sign({ id: 'user-123' }, 'test-secret', { expiresIn: '1ms' });
  await new Promise((resolve) => setTimeout(resolve, 25));

  const req = {
    cookies: { token: expiredToken },
    headers: {},
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  try {
    await authUser(req, res, () => {
      throw new Error('next should not run for expired tokens');
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.payload.message, 'Token expired');
  } finally {
    blacklistModel.findOne = previousBlacklist;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('getAllInterviewReportsController returns only the authenticated user reports', async () => {
  const previousFind = interviewReportModel.find;
  interviewReportModel.find = (query) => {
    assert.deepEqual(query, { user: 'user-123' });
    return {
      sort: () => ({
        select: async () => [{ _id: 'report-1', title: 'Frontend Developer' }],
      }),
    };
  };

  const req = { user: { _id: 'user-123' } };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  try {
    await interviewController.getAllInterviewReportsController(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.payload.interviewReports, [{ _id: 'report-1', title: 'Frontend Developer' }]);
  } finally {
    interviewReportModel.find = previousFind;
  }
});

test('deleteInterviewReportController removes only the authenticated user report', async () => {
  const previousDelete = interviewReportModel.findOneAndDelete;
  interviewReportModel.findOneAndDelete = async (query) => {
    assert.deepEqual(query, { _id: 'report-123', user: 'user-123' });
    return { _id: 'report-123', title: 'Frontend Developer' };
  };

  const req = {
    params: { id: 'report-123' },
    user: { _id: 'user-123' },
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  try {
    await interviewController.deleteInterviewReportController(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.message, 'Interview report deleted successfully');
    assert.equal(res.payload.deletedReport._id, 'report-123');
  } finally {
    interviewReportModel.findOneAndDelete = previousDelete;
  }
});
