import { useState, useContext } from 'react'
import { deleteInterviewReport, getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from '../services/interview.api.js'
import { InterviewContext } from '../interview.context.jsx'
import {useParams} from 'react-router-dom'
import { useEffect } from 'react'

const initialFormState = {
  jobDescription: '',
  resumeName: '',
  selfDescription: ''
}

export default function useInterviewForm() {
  const [form, setForm] = useState(initialFormState)
  const {interviewId} = useParams()

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
      if (reportData?._id) {
        setReports((previousReports) => [
          { _id: reportData._id, title: reportData.title || 'Untitled Report', createdAt: reportData.createdAt || new Date().toISOString() },
          ...previousReports.filter((item) => item?._id !== reportData._id)
        ]);
      }
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

  const getResumePdf = async (interviewReportId) => {
    setLoading(true)

    try {
      const response = await generateResumePdf({ interviewReportId })
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('Error while generating pdf in userInterview hook.js', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteReport = async (reportId) => {
    try {
      await deleteInterviewReport(reportId);
      setReports((previousReports) => previousReports.filter((report) => report._id !== reportId));
      return true;
    } catch (error) {
      console.error('Error deleting interview report:', error);
      throw error;
    }
  };

useEffect(() => {
    if(interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId]);

  return {
    form,
    updateField,
    handleFileChange,
    resetForm,
    generateReport,
    getReportById,
    getAllReports,
    deleteReport,
    loading,
    report,
    reports,
    getResumePdf

  }
}
