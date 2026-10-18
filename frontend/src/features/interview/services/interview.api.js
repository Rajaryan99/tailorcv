import axios from 'axios'

const TOKEN_STORAGE_KEY = 'tailorcv_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tailorcv-backend-w45u.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
};

const syncAuthToken = () => {
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (storedToken) {
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    return storedToken;
  }

  delete api.defaults.headers.common.Authorization;
  return null;
};

api.interceptors.request.use((config) => {
  const storedToken = syncAuthToken();

  if (storedToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      setAuthToken(null);
    }

    return Promise.reject(error);
  }
)

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

/**
 * @description Service to generate resume PDF based on JD and slef-description amd resume provided.
 */

export const generateResumePdf  = async ({interviewReportId}) => {
  const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}`, {
    responseType: 'blob'
  })

  return response.data;
}
