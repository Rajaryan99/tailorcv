export async function generateInterviewPlan(payload) {
  console.info('UI-only mode: interview API not connected yet.', payload)

  return {
    success: true,
    message: 'UI preview only - backend wiring pending.'
  }
}
