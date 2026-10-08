import axios from 'axios'

export async function generateInterviewPlan(payload) {
  console.info('UI-only mode: interview API not connected yet.', payload)

  return {
    success: true,
    message: 'UI preview only - backend wiring pending.'
  }
}



const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 */

export const generateInterviewReport = async ({ jobDescription, resumeFile, selfDescription }) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription);
  formData.append('selfDescription', selfDescription);

  if (resumeFile) {
    formData.append('resume', resumeFile);
  }

  try {
    const response = await api.post('/api/interview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error generating interview report:', error);
    throw error;
  }
}


/**
 * @desc Get an interview report by interviewId.
 */


export const getInterviewReportById = async (id) => {
  try {
    const response = await api.get(`/api/interview/report/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching interview report by ID:', error);
    throw error;
  } 
}

/**
 * 
 * @desc get all the generated interview report.
 */

export const getAllInterviewReports = async () => {
  try {
    const response = await api.get('/api/interview');
    return response.data;
  } catch (error) {
    console.error('Error fetching all interview reports:', error);
    throw error;
  }
}

export const deleteInterviewReport = async (id) => {
  try {
    const response = await api.delete(`/api/interview/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting interview report:', error);
    throw error;
  }
} 
