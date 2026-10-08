import { GoogleGenAI } from "@google/genai";
import * as z from 'zod'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export function createFallbackInterviewReport({ resume = '', selfDescription = '', jobDescription = '' }) {
    const text = `${resume} ${selfDescription} ${jobDescription}`.toLowerCase();
    const containsReact = text.includes('react');
    const containsNode = text.includes('node');
    const containsMongo = text.includes('mongodb');
    const containsJs = text.includes('javascript') || text.includes('js');

    const matchScore = Math.min(96, Math.max(72, (
        (containsReact ? 22 : 0) +
        (containsNode ? 20 : 0) +
        (containsMongo ? 14 : 0) +
        (containsJs ? 18 : 0) +
        18
    )));

    const title = (jobDescription || 'Frontend / Full Stack Developer').split(/\n|\.|:/)[0].trim() || 'Frontend / Full Stack Developer';

    const technicalQuestions = [
        {
            question: 'Can you explain how React renders and updates the UI efficiently?',
            intention: 'Assess understanding of rendering, virtual DOM, reconciliation, and performance optimization.',
            answer: 'Explain the virtual DOM, component re-rendering, reconciliation, and when to use memoization with useMemo and useCallback.'
        },
        {
            question: 'How do you structure a REST API in Express.js and secure it?',
            intention: 'Check backend design knowledge and API security understanding.',
            answer: 'Describe route setup, controllers, middleware, validation, JWT auth, input validation, and handling errors with proper status codes.'
        },
        {
            question: 'How would you connect a React frontend to MongoDB through a Node backend?',
            intention: 'Evaluate end-to-end full stack architecture awareness.',
            answer: 'Explain using Express routes, Mongoose models, DTO validation, CRUD logic, and secure API calls from the frontend with async requests.'
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
        { skill: 'Advanced system design', severity: 'medium' },
        { skill: 'Production deployment optimization', severity: 'medium' },
        { skill: 'Testing and debugging automation', severity: 'low' }
    ];

    const preparationPlan = Array.from({ length: 7 }, (_, index) => ({
        day: index + 1,
        focus: index < 2 ? 'Core frontend and JavaScript fundamentals' : index < 4 ? 'Backend API and database workflows' : 'Project polish and interview readiness',
        tasks: [
            'Review key JavaScript concepts and practice mini exercises.',
            'Build or refactor a small React component using hooks and state.',
            'Practice API integration and error handling in a demo app.',
            'Create a small Express route and connect it to MongoDB.',
            'Refine your resume and portfolio projects for clarity.',
            'Prepare answers for common frontend and full-stack interview questions.',
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

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: z.toJSONSchema(interviewReportSchema)
            }
        })

        const report = JSON.parse(response.text)
        return interviewReportSchema.parse(report)
    } catch (error) {
        console.error("Error generating interview report, using fallback data:", error);
        return createFallbackInterviewReport({ resume, selfDescription, jobDescription });
    }
}

export default generateInterviewReport
