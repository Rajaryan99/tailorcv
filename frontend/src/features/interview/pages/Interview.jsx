import React, { useEffect, useMemo, useState } from 'react'
import '../styles/interview.scss'
import { useInterviewContext } from '../hooks/useInterviewContext.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterviewReportById } from '../services/interview.api.js'

// const interviewData = {
//   matchScore: 92,
//   technicalQuestion: [
//     {
//       question: "Can you explain how React's virtual DOM works and how hooks like useMemo and useCallback help optimize performance?",
//       intention: 'To assess the candidate\'s core understanding of React rendering mechanics, reconciliation, and memory/performance management.',
//       answer: 'Explain that the virtual DOM is an in-memory representation of real DOM elements. When state changes, React creates a new virtual DOM tree, diffs it with the previous one (reconciliation), and updates only the altered nodes in the actual DOM. Mention that useMemo caches the result of expensive computations across re-renders, while useCallback caches function definitions to prevent unnecessary child re-renders when passing callbacks down to memoized components.'
//     },
//     {
//       question: 'How does the JavaScript Event Loop manage asynchronous tasks, microtasks, and macrotasks?',
//       intention: 'To test foundational JavaScript runtime knowledge and understanding of asynchronous execution order.',
//       answer: 'Describe the call stack, Web APIs, callback/macrotask queue (setTimeout, setInterval, I/O), and microtask queue (Promises, queueMicrotask, MutationObserver). Emphasize that the event loop checks if the call stack is empty; once empty, all tasks in the microtask queue run to completion before processing the next macrotask.'
//     },
//     {
//       question: 'How do you securely handle JWT authentication between a React client and an Express backend?',
//       intention: 'To evaluate full-stack security practices, token storage, and session handling.',
//       answer: 'Explain the full authentication flow: the client sends credentials, the backend validates them, generates signed JWTs (access token and refresh token), and sends them back. Highlight best practices such as storing refresh tokens in HttpOnly, Secure, SameSite cookies to protect against XSS, and keeping short-lived access tokens in memory or auth context. Mention using Axios/fetch interceptors to catch 401 errors and automatically refresh access tokens.'
//     }
//   ],
//   behaviouralQuestion: [
//     {
//       question: 'Describe a difficult bug you encountered in a full-stack project and the methodology you used to resolve it.',
//       intention: 'To assess debugging skills, systematic problem-solving approach, and persistence under pressure.',
//       answer: 'Structure the answer using the STAR method. Detail the specific bug, explain the isolation process using browser dev tools and backend logs, explain the root cause identified, and conclude with the fix implemented alongside preventative steps like regression testing or error logging.'
//     },
//     {
//       question: 'How do you balance rapid feature delivery with code quality and clean architecture when working independently or under tight deadlines?',
//       intention: 'To evaluate prioritization, architectural discipline, and pragmatic technical trade-offs.',
//       answer: 'Explain your approach to breaking features into MVP increments. Highlight the practice of writing modular, reusable components and clean API contracts upfront to prevent technical debt. Mention using linting, TypeScript interfaces, and focused testing early, and setting aside time for refactoring once core requirements are validated.'
//     }
//   ],
//   skillGaps: [
//     { skill: 'Automated Unit and Integration Testing', severity: 'medium' },
//     { skill: 'Tailwind CSS and Modern CSS', severity: 'low' },
//     { skill: 'Web Performance Optimization', severity: 'medium' },
//     { skill: 'Event loop and async JS deep dive', severity: 'high' }
//   ],
//   preparationPlan: [
//     {
//       day: 1,
//       focus: 'Core JavaScript and Asynchronous Programming Mastery',
//       tasks: [
//         'Review closures, prototypes, and event bubbling in JavaScript.',
//         'Implement Promise, debounce, and throttle patterns.',
//         'Solve 3-5 medium-level coding challenges focused on arrays and objects.'
//       ]
//     },
//     {
//       day: 2,
//       focus: 'React Architecture, Hooks, and Component Patterns',
//       tasks: [
//         'Deep dive into React rendering cycles and reconciliation.',
//         'Practice building custom hooks for API calls and local state.',
//         'Review optimization patterns using React.memo, useMemo, and useCallback.'
//       ]
//     }
//   ]
// }

const sections = [
  { id: 'technical', label: 'Technical questions' },
  { id: 'behavioral', label: 'Behavioral questions' },
  { id: 'roadmap', label: 'Road Map' }
]

export default function Interview() {
  const [activeSection, setActiveSection] = useState('technical')
  const [expandedItems, setExpandedItems] = useState({})
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const { report, setReport } = useInterviewContext()

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
