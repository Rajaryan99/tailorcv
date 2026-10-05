import React from 'react'
import '../styles/home.scss'

export default function Home() {
  return (

    <main className='home'>
        <div className="interviewInputGroup">
        <div className="left">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea name="jobDescription" id="jobDescription" placeholder='Enter job Description......'></textarea>
        </div>
        <div className="right">
            <div className="inputGroup">
                <p>Resume <small className='highlight'>(use resume and slef Description both for better results)</small></p>
                <label htmlFor="resume" className='fileLable'>Upload Resume</label>
                <input hidden type="file" name="resume" id="resume" accept='.pdf' />
            </div>
            <div className="inputGroup">
                <label htmlFor="selfDescription">Self Description</label>
                <textarea name="selfDescription" id="selfDescription" placeholder='Enter self Description......'></textarea>
            </div>
            <button className='button primary-button generateBtn'>Generate Report</button>
        </div>
        </div>

    </main>
  )
}
