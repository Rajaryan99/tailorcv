import { useState, useContext } from 'react'
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from '../services/interview.api.js'
import { InterviewContext } from '../interview.context.jsx'

const initialFormState = {
  jobDescription: '',
  resumeName: '',
  selfDescription: ''
}

export default function useInterviewForm() {
  const [form, setForm] = useState(initialFormState)

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    updateField('resumeName', file ? file.name : '')
  }

  const resetForm = () => setForm(initialFormState)

  const context = useContext(InterviewContext);

  if(!context) {
    throw new Error('useInterviewForm must be used within an InterviewProvider');
  }

  const {loading, setLoading, report, setReport, reports, setReports} = context;  

  const generateReport = async ({jobDescription, resumeFile, selfDescription}) => {
    setLoading(true);
    try {
      const generatedReport = await generateInterviewReport({jobDescription, resumeFile, selfDescription});
      const reportData = generatedReport?.interviewReport || generatedReport?.interviewReportByAi || generatedReport;
      setReport(reportData);
      return generatedReport;
    } catch (error) {
      console.error('Error generating interview report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (id) => {
    setLoading(true);
    try {
      const reportById = await getInterviewReportById(id);
      setReport(reportById.interviewReport);
      return reportById;
    } catch (error) {
      console.error('Error fetching interview report by ID:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const allReports = await getAllInterviewReports();
      setReports(allReports.interviewReports);
      return allReports;
    } catch (error) {
      console.error('Error fetching all interview reports:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    updateField,
    handleFileChange,
    resetForm,
    generateReport,
    getReportById,
    getAllReports,
    loading,
    report,
    reports
  }
}
