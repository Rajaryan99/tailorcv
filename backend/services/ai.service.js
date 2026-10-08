import { GoogleGenAI } from "@google/genai";
import * as z from 'zod'
import puppeteer from 'puppeteer';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});



export function createFallbackInterviewReport({ resume = '', selfDescription = '', jobDescription = '' }) {
    const text = `${resume} ${selfDescription} ${jobDescription}`.toLowerCase();
    const detectedSkills = [
        { key: 'react', label: 'React', weight: 20 },
        { key: 'node', label: 'Node.js', weight: 18 },
        { key: 'mongodb', label: 'MongoDB', weight: 16 },
        { key: 'javascript', label: 'JavaScript', weight: 18 },
        { key: 'typescript', label: 'TypeScript', weight: 17 },
        { key: 'python', label: 'Python', weight: 15 },
        { key: 'sql', label: 'SQL', weight: 15 },
        { key: 'aws', label: 'AWS', weight: 14 },
        { key: 'docker', label: 'Docker', weight: 12 },
    ].filter(({ key }) => text.includes(key));

    const skillNames = detectedSkills.map(({ label }) => label);
    const matchScore = Math.min(96, Math.max(62, detectedSkills.reduce((total, skill) => total + skill.weight, 18)));

    const title = (jobDescription || 'Frontend / Full Stack Developer').split(/\n|\.|:/)[0].trim() || 'Frontend / Full Stack Developer';

    const technicalQuestions = [
        {
            question: skillNames.includes('React')
                ? 'Can you explain how React renders and updates the UI efficiently?'
                : 'How do you structure a robust front-end application for maintainability and performance?',
            intention: 'Assess understanding of rendering, component design, and performance optimization.',
            answer: skillNames.includes('React')
                ? 'Explain the virtual DOM, component re-rendering, reconciliation, and when to use memoization with useMemo and useCallback.'
                : 'Discuss component boundaries, state design, reusable hooks, and performance profiling for a scalable UI.'
        },
        {
            question: skillNames.includes('Node.js')
                ? 'How do you structure a REST API in Express.js and secure it?'
                : 'How would you design an API layer that is reliable, testable, and easy to extend?',
            intention: 'Check backend design knowledge and API security understanding.',
            answer: 'Describe route setup, controllers, middleware, validation, JWT auth, input validation, and handling errors with proper status codes.'
        },
        {
            question: skillNames.includes('MongoDB')
                ? 'How would you connect a React frontend to MongoDB through a Node backend?'
                : 'How would you model and query data for a production application?',
            intention: 'Evaluate end-to-end architecture awareness.',
            answer: 'Explain schema design, indexing, query optimization, and the flow between the client, API, and database layer.'
        },
        {
            question: 'What is the difference between frontend state and backend state, and when would you choose each?',
            intention: 'Test knowledge of application state ownership and UX design.',
            answer: 'Frontend state is for UI interactions and client-side data; backend state handles persistent or shared data. Use frontend state for form inputs and local UI, backend state for user data and business logic.'
        },
        {
            question: 'How do you debug a slow or broken web application?',
            intention: 'Measure problem-solving and debugging mindset.',
            answer: 'Start by reproducing the issue, checking browser console and network requests, verifying backend logs, and isolating the root cause before patching.'
        }
    ];

    const behaviouralQuestions = [
        {
            question: 'Describe a time you solved a difficult bug or feature issue.',
            intention: 'Understand the candidate’s debugging approach and ownership.',
            answer: 'Use the STAR method: context, task, action, result. Emphasize how you reproduced the issue, identified the root cause, and validated the fix.'
        },
        {
            question: 'How do you stay productive when working on multiple tasks or deadlines?',
            intention: 'Assess prioritization and planning skills.',
            answer: 'Explain how you break work into priorities, set milestones, avoid scope creep, and communicate progress to stakeholders when timelines shift.'
        },
        {
            question: 'How do you handle feedback on your code or work?',
            intention: 'Evaluate learning mindset and collaboration.',
            answer: 'Share how you review suggestions carefully, improve based on feedback, and keep learning by refining your implementation and communication.'
        }
    ];

    const skillGaps = [
        { skill: skillNames.length ? `Deepening ${skillNames[0]} expertise` : 'Advanced system design', severity: 'medium' },
        { skill: 'Production deployment optimization', severity: 'medium' },
        { skill: 'Testing and debugging automation', severity: 'low' }
    ];

    const focusAreas = skillNames.length > 0 ? skillNames.slice(0, 3) : ['Core web fundamentals', 'API design', 'Interview readiness'];

    const preparationPlan = Array.from({ length: 7 }, (_, index) => ({
        day: index + 1,
        focus: index < 2
            ? `Strengthen ${focusAreas[0] || 'front-end'} fundamentals`
            : index < 4
                ? `Practice ${focusAreas[1] || 'backend'} architecture and APIs`
                : `Polish ${focusAreas[2] || 'system design'} and interview readiness`,
        tasks: [
            'Review key concepts and practice targeted exercises.',
            'Build or refactor a small feature using the relevant tech stack.',
            'Practice API integration and error handling in a demo app.',
            'Create or improve a small project tied to the job requirements.',
            'Refine your resume and portfolio projects for clarity.',
            'Prepare answers for common technical and behavioral questions.',
            'Do a final mock interview and review project walkthroughs.'
        ]
    }));

    return {
        matchingScore: Math.round(matchScore),
        technicalQuestions,
        behaviouralQuestions,
        skillGaps,
        preparationPlan,
        title,
    };
}

export const interviewReportSchema = z.object({
    matchingScore: z.number().min(0).max(100).describe("The matching score between the candidate's profile and the job description, ranging from 0 to 100."),
    technicalQuestions:  z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interview behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(5).describe("At least five technical questions that can be asked in the interview, along with their intention and how to answer them."),
    behaviouralQuestions:  z.array(z.object({
        question: z.string().describe("The behavioural question that can be asked in the interview"),
        intention: z.string().describe("The intention of interview behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("At least three behavioural questions that can be asked in the interview, along with their intention and how to answer them."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skills gap.")
    })).describe("List of the skill gaps in the candidate's profile along with their severity."),
    preparationPlan: z.array(z.object({
        day: z.number().int().positive().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus of the day, what to learn, what to practice etc."),
        tasks: z.array(z.string()).describe("The tasks to be completed on that day.")
})).min(7).describe("A seven-day preparation plan for the candidate to improve their skills and prepare for the interview."),
title: z.string().describe("The title of the job for which the candidate is applying, summarizing the candidate's profile and the job description.")

})


export async function generateInterviewReport({resume, selfDescription, jobDescription}){
    const prompt = `Generate an interview report for a candidate based on the following information.
                        Return only JSON that exactly matches the provided response schema. Include at least 5 technical questions, 3 behavioural questions, and a 7-day preparation plan.
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`

    const modelCandidates = ['gemini-3.8-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];

    for (const model of modelCandidates) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseJsonSchema: z.toJSONSchema(interviewReportSchema)
                }
            });

            const candidateText = response.text || '';
            const cleanText = candidateText.replace(/```json|```/g, '').trim();
            const report = JSON.parse(cleanText);
            return interviewReportSchema.parse(report);
        } catch (error) {
            console.warn(`Gemini model ${model} failed, trying the next available model if any:`, error?.message || error);
        }
    }

    console.error('Error generating interview report, using fallback data.');
    return createFallbackInterviewReport({ resume, selfDescription, jobDescription });
}


export async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}


function buildFallbackResumeHtml({ resume = '', selfDescription = '', jobDescription = '' }) {
    const contactLine = selfDescription || 'Experienced candidate';
    const skillMatches = [
        'React', 'Node.js', 'MongoDB', 'TypeScript', 'JavaScript',
        'REST APIs', 'HTML', 'CSS', 'Problem Solving', 'Team Collaboration'
    ].filter((skill) =>
        `${resume} ${selfDescription} ${jobDescription}`.toLowerCase().includes(skill.toLowerCase()) || skill === 'Problem Solving' || skill === 'Team Collaboration'
    );

    const skills = skillMatches.length > 0 ? skillMatches : ['JavaScript', 'React', 'Node.js', 'Problem Solving'];
    const summary = selfDescription?.trim() || 'Motivated software engineer with hands-on experience building and shipping high-quality web products.';

    return `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; color: #1f2937; background: #fff; }
              .page { width: 794px; min-height: 1123px; margin: 0 auto; padding: 40px 48px; box-sizing: border-box; }
              h1 { margin: 0 0 6px; font-size: 32px; letter-spacing: 0.03em; }
              .sub { color: #475569; margin: 0 0 18px; font-size: 14px; }
              .section { margin-top: 20px; }
              .section h2 { font-size: 16px; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 2px solid #dbeafe; text-transform: uppercase; letter-spacing: 0.08em; }
              ul { margin: 0; padding-left: 20px; }
              li { margin-bottom: 6px; font-size: 13px; line-height: 1.5; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
              .skill { background: #eff6ff; color: #1d4ed8; border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="page">
              <h1>Candidate Profile</h1>
              <p class="sub">${summary}</p>

              <div class="section">
                <h2>Summary</h2>
                <ul>
                  <li>${summary}</li>
                  <li>Experienced in building user-friendly web applications and collaborating with engineering teams.</li>
                  <li>Strong focus on quality, maintainability, performance, and practical business impact.</li>
                </ul>
              </div>

              <div class="section">
                <h2>Skills</h2>
                <div class="skills">
                  ${skills.map((skill) => `<span class="skill">${skill}</span>`).join('')}
                </div>
              </div>

              <div class="section">
                <h2>Experience Highlights</h2>
                <ul>
                  <li>Built and shipped front-end, back-end, and full-stack features with a product-focused mindset.</li>
                  <li>Improved user workflows, application reliability, and maintainability through clear architecture and testing.</li>
                  <li>Worked with modern JavaScript stacks and practical delivery patterns aligned with the target role.</li>
                </ul>
              </div>

              <div class="section">
                <h2>Target Role</h2>
                <ul>
                  <li>${(jobDescription || 'Full stack / frontend engineering role').split(/\n|\.|:/)[0].trim() || 'Full stack / frontend engineering role'}</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
    `;
}

export async function generateResumePdf({resume, selfDescription, jobDescription}) {
    try {
        const resumePdfSchema = z.object({
            html: z.string().describe("The HTML content of the resume PDF."),
        });

        const prompt = `Generate a professional resume in HTML format for a candidate based on the following information.
                        Return only JSON that exactly matches the provided response schema.
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The content should be ATS-friendly, visually appealing, and well-structured. Include sections for contact information, summary, skills, experience, education, and relevant projects. Keep it to one page. Use only valid HTML markup and no markdown.`;

        const modelCandidates = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];

        for (const model of modelCandidates) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseJsonSchema: z.toJSONSchema(resumePdfSchema)
                    }
                });

                const generatedText = response?.text || '{}';
                const cleanText = generatedText.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleanText || '{}');

                if (parsed?.html) {
                    return await generatePdfFromHtml(parsed.html);
                }
            } catch (error) {
                console.warn(`Resume PDF model ${model} failed, trying the next available model if any:`, error?.message || error);
            }
        }

        const fallbackHtml = buildFallbackResumeHtml({ resume, selfDescription, jobDescription });
        return await generatePdfFromHtml(fallbackHtml);
    } catch (error) {
        console.error('Error generating resume PDF:', error);
        throw error;
    }
}



   


export default {generateInterviewReport, generateResumePdf}
