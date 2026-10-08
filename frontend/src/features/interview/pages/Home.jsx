import React, { useState, useRef } from 'react'
import useInterviewForm from '../hooks/useInterviewForm'
import '../styles/home.scss'
import { useNavigate } from 'react-router-dom'

const MAX_JOB_LENGTH = 5000

export default function Home() {
  const { form, updateField, handleFileChange, generateReport, loading, reports, deleteReport } = useInterviewForm()
  const jobLength = form.jobDescription.length

  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const resumeInputRef = useRef(null);

  const navigate = useNavigate();


  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0] || null;

    if (!jobDescription.trim() || !selfDescription.trim()) {
      alert('Please enter both the job description and your self-description.');
      return;
    }

    try {
      const data = await generateReport({ jobDescription, resumeFile, selfDescription });
      const finalReport = data?.interviewReport || data?.interviewReportByAi || data;

      if (!finalReport || !finalReport._id) {
        alert('The report could not be generated right now. Please try again.');
        return;
      }

      navigate(`/interview/${finalReport._id}`, { state: { report: finalReport } });
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong while generating the report.';
      alert(message);
    }
  }


  return (
    <main className='interview-page'>
      <div className='interview-shell'>
        <div className='topbar-actions'>
          <button type='button' className='profile-nav-button' onClick={() => navigate('/profile')}>
            Profile
          </button>
           <button type='button' className='profile-nav-button' onClick={() => navigate('/login')}>
            login
          </button>
        </div>

        

        <header className='interview-header'>
          <h1>
            Create Your Custom <span>Interview</span> Plan
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </header>

        <section className='interview-panel'>
          <div className='input-card job-card'>
            <div className='card-header'>
              <span className='badge'>✦</span>
              <h2>Target Job Description</h2>
            </div>

            <textarea
              id='jobDescription'
              name='jobDescription'
              value={form.jobDescription}
              onChange={(event) => {setJobDescription(event.target.value); updateField('jobDescription', event.target.value)}  }
              maxLength={MAX_JOB_LENGTH}
              placeholder='Paste the full job description here...'
            />

            <div className='char-counter'>
              <span>{jobLength}</span>
              <span> / {MAX_JOB_LENGTH} chars</span>
            </div>
          </div>

          <div className='input-card profile-card'>
            <div className='card-header'>
              <span className='badge'>✦</span>
              <h2>Your Profile</h2>
            </div>

            <label htmlFor='resume' className='upload-box'>
              <input
                id='resume'
                type='file'
                accept='.pdf,.doc,.docx'
                hidden
                onChange={handleFileChange}
                ref={resumeInputRef}
              />
              <span className='upload-icon'>⬆</span>
              <span className='upload-copy'>Click to upload or drag &amp; drop</span>
              <small>{form.resumeName || 'PDF or DOCX (Max 5MB)'}</small>
            </label>

            <div className='divider'>OR</div>

            <label htmlFor='selfDescription' className='field-label'>Quick Self-Description</label>
            <textarea
              id='selfDescription'
              name='selfDescription'
              value={form.selfDescription}
              onChange={(event) => {setSelfDescription(event.target.value); updateField('selfDescription', event.target.value)}}
              placeholder='Briefly describe your experience, key skills, and years of experience. '
            />

            <div className='helper-alert'>
              <span className='alert-dot'>i</span>
              Either a resume or a self description is required to generate a personalized plan.
            </div>

            <button
              type='button'
              className={loading ? 'cta-button loading' : 'cta-button'}
              onClick={handleGenerateReport}
              disabled={loading}
              aria-live='polite'
            >
              {loading ? (
                <>
                  <span className='spinner' aria-hidden='true' />
                  <span>Generating...</span>
                </>
              ) : (
                'Generate Interview Strategy'
              )}
            </button>
          </div>
        </section>

        {/* recent report list */}
        {reports.length > 0 && (
          <section className='recent-reports'>
            <h2>Recent Reports</h2>
            <ul className='report-list'>
              {reports.map((report) => (
                <li key={report._id} className='report-item'>
                  <div className='report-row'>
                    <button
                      type='button'
                      className='report-title-button'
                      onClick={() => navigate(`/interview/${report._id}`, { state: { report } })}
                    >
                      {report.title || 'Untitled Report'}
                    </button>
                    <button
                      type='button'
                      className='report-delete-button'
                      onClick={async (event) => {
                        event.stopPropagation();
                        const confirmed = window.confirm('Delete this report?');
                        if (!confirmed) return;

                        try {
                          await deleteReport(report._id);
                        } catch (error) {
                          alert('Failed to delete the report. Please try again.');
                        }
                      }}
                      aria-label={`Delete ${report.title || 'report'}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className='interview-footer'>
          <button type='button' className='footer-link-button' onClick={() => navigate('/profile')}>
            Profile
          </button>
          <a href='#'>Privacy Policy</a>
          <a href='#'>Terms of Service</a>
          <a href='#'>Help Center</a>
        </footer>
      </div>
    </main>
  )
}
