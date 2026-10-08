import React, { useEffect, useMemo, useState } from 'react'
import '../styles/interview.scss'
import { useInterviewContext } from '../hooks/useInterviewContext.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterviewReportById } from '../services/interview.api.js'
import useInterviewForm from '../hooks/useInterviewForm.js'



const sections = [
  { id: 'technical', label: 'Technical questions' },
  { id: 'behavioral', label: 'Behavioral questions' },
  { id: 'roadmap', label: 'Road Map' }
]

export default function Interview() {
  const [activeSection, setActiveSection] = useState('technical')
  const [expandedItems, setExpandedItems] = useState({})
  const [isDownloading, setIsDownloading] = useState(false)
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const { report, setReport } = useInterviewContext()
  const { getResumePdf } = useInterviewForm()

  useEffect(() => {
    if (!interviewId) return

    const loadReport = async () => {
      try {
        const response = await getInterviewReportById(interviewId)
        const fullReport = response?.interviewReport || response
        if (fullReport) {
          setReport(fullReport)
        }
      } catch (error) {
        console.error('Error loading saved report:', error)
      }
    }

    loadReport()
  }, [interviewId, setReport])

  const handleGenerateNewReport = () => {
    setReport(null)
    window.localStorage.removeItem('tailorcv-current-report')
    navigate('/home', { replace: true })
  }

  const safeReport = report || {
    matchScore: 0,
    technicalQuestion: [],
    behaviouralQuestion: [],
    skillGaps: [],
    preparationPlan: []
  }

  const currentItems = useMemo(() => {
    if (activeSection === 'technical') return safeReport.technicalQuestion || []
    if (activeSection === 'behavioral') return safeReport.behaviouralQuestion || []
    return safeReport.preparationPlan || []
  }, [activeSection, safeReport])

  const toggleItem = (index) => {
    setExpandedItems((previous) => ({
      ...previous,
      [`${activeSection}-${index}`]: !previous[`${activeSection}-${index}`]
    }))
  }

  // useEffect(() => {
  //   if (InterviewId) {
  //     getInterviewReportById(InterviewId)
  //   }
  // }, [InterviewId])

  return (
    <main className='interview-report-page'>
      <div className='report-shell'>
        <aside className='report-nav'>
          {sections.map((section) => (
            <button
              key={section.id}
              type='button'
              className={activeSection === section.id ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>

          ))}

          <button
            type='button'
            className={`generate-new-pdf ${isDownloading ? 'is-loading' : ''}`}
            disabled={isDownloading}
            onClick={async () => {
              if (!interviewId) return
              setIsDownloading(true)
              try {
                await getResumePdf(interviewId)
              } catch (error) {
                console.error('Error downloading resume PDF:', error)
                alert('Unable to download the resume PDF. Please try again.')
              } finally {
                setIsDownloading(false)
              }
            }}
          >
            {isDownloading ? (
              <>
                <span className='download-spinner' aria-hidden='true' />
                Downloading...
              </>
            ) : (
              'Download Resume'
            )}
          </button>
        </aside>

        <section className='report-content'>
          {activeSection === 'roadmap' ? (
            <div className='roadmap-timeline'>
              <div className='roadmap-header'>
                <h2>Preparation Road Map</h2>
                <span className='roadmap-total'>7-day plan</span>
              </div>

              <div className='timeline-list'>
                {currentItems.map((plan, index) => (
                  <article key={plan.day} className='timeline-item'>
                    <div className='timeline-marker'>
                      <span>{plan.day}</span>
                    </div>
                    <div className='timeline-content'>
                      <h3>{plan.focus}</h3>
                      <ul>
                        {plan.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className='qa-list'>
              {currentItems.map((item, index) => {
                const itemKey = `${activeSection}-${index}`
                const isOpen = !!expandedItems[itemKey]

                return (
                  <article key={itemKey} className={`qa-card ${isOpen ? 'open' : ''}`}>
                    <button
                      type='button'
                      className='question-toggle'
                      onClick={() => toggleItem(index)}
                    >
                      <span className='question-number'>{index + 1}</span>
                      <span className='question-text'>{item.question}</span>
                      <span className='toggle-icon'>{isOpen ? '−' : '+'}</span>
                    </button>

                    {isOpen && (
                      <div className='qa-details'>
                        <div className='qa-block'>
                          <p className='qa-label'>Intention</p>
                          <p>{item.intention}</p>
                        </div>
                        <div className='qa-block'>
                          <p className='qa-label'>Answer</p>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <aside className='report-sidebar'>
          <div className='score-box'>
            <span className='score-label'>Match Score</span>
            <strong>{safeReport.matchScore || 0}%</strong>
          </div>

          <h3>Skill Gaps</h3>
          <div className='skill-gaps'>
            {(safeReport.skillGaps || []).map((gap) => (
              <span key={gap.skill} className={`skill-pill ${gap.severity}`}>
                {gap.skill}
              </span>
            ))}
          </div>

          <button type='button' className='generate-new-button' onClick={handleGenerateNewReport}>
            Generate New Report
          </button>
        </aside>
      </div>
    </main>
  )
}
