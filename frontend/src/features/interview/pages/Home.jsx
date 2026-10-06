import React from 'react'
import useInterviewForm from '../hooks/useInterviewForm'
import '../styles/home.scss'

const MAX_JOB_LENGTH = 5000

export default function Home() {
  const { form, updateField, handleFileChange } = useInterviewForm()
  const jobLength = form.jobDescription.length

  return (
    <main className='interview-page'>
      <div className='interview-shell'>
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
              onChange={(event) => updateField('jobDescription', event.target.value)}
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
              onChange={(event) => updateField('selfDescription', event.target.value)}
              placeholder='Briefly describe your experience, key skills, and years of experience. '
            />

            <div className='helper-alert'>
              <span className='alert-dot'>i</span>
              Either a resume or a self description is required to generate a personalized plan.
            </div>

            <button type='button' className='cta-button'>
              Generate Interview Strategy
            </button>
          </div>
        </section>

        <footer className='interview-footer'>
          <a href='#'>Privacy Policy</a>
          <a href='#'>Terms of Service</a>
          <a href='#'>Help Center</a>
        </footer>
      </div>
    </main>
  )
}
