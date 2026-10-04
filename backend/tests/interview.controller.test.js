import test from 'node:test';
import assert from 'node:assert/strict';
import interviewController, { getUploadedResume } from '../controllers/interview.controller.js';

test('getUploadedResume accepts a file uploaded under the legacy file field name', () => {
  const uploadedFile = { originalname: 'resume.pdf', buffer: Buffer.from('pdf') };
  const req = { files: { file: [uploadedFile] } };

  assert.equal(getUploadedResume(req), uploadedFile);
});

test('generateInterviewReportController rejects missing upload file with a 400 response', async () => {
  const req = {
    body: {
      selfDescription: 'I am a software engineer',
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
  assert.equal(res.payload.message, 'Resume PDF is required');
});
