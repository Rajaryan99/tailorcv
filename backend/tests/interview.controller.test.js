import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import interviewController, { getUploadedResume } from '../controllers/interview.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import blacklistModel from '../models/blacklist.model.js';

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
