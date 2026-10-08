import test from 'node:test';
import assert from 'node:assert/strict';
import { createFallbackInterviewReport } from '../services/ai.service.js';

test('createFallbackInterviewReport builds a valid report structure', () => {
  const report = createFallbackInterviewReport({
    resume: 'React, Node, Express, MongoDB, JavaScript',
    selfDescription: 'I build frontend and backend apps.',
    jobDescription: 'Need React and Node developer.'
  });

  assert.ok(report);
  assert.ok(report.matchingScore >= 0 && report.matchingScore <= 100);
  assert.ok(Array.isArray(report.technicalQuestions));
  assert.ok(report.technicalQuestions.length >= 5);
  assert.ok(Array.isArray(report.behaviouralQuestions));
  assert.ok(report.behaviouralQuestions.length >= 3);
  assert.ok(Array.isArray(report.skillGaps));
  assert.ok(Array.isArray(report.preparationPlan));
  assert.ok(report.preparationPlan.length >= 7);
  assert.ok(typeof report.title === 'string');
});
