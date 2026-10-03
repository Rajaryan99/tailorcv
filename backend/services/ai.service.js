import { GoogleGenAI } from "@google/genai";
import * as z from 'zod'
import {zodToJsonSchema} from 'zod-to-json-schema'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = z.object({
    matchingScore: z.number().describe("The matching score between the candidate's profile and the job description, ranging from 0 to 100."),
    technicalQuestions:  z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interview behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical question that can be asked in the interciew along with their intention and how to answer them."),
    behaviouralQuestions:  z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interview behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioural question that can be asked in the interciew along with their intention and how to answer them."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking."),
        serverity: z.enum(["low", "medium", "high"]).describe("The severity of the skills gap,")
    })).describe("List of the skill gaps in the candidate's profle along with their severity."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The focus of the day, what to learn, what to practice etc."),
        tasks: z.array(z.string()).describe("The tasks to be completed on that day.")
})).describe("The preparation plan for the candidate to improve their skills and prepare for the interview.")

})


export async function generateInterviewReport({resume, selfDescription, jobDescription}){


    const prompt = `Generate an interview report for a candidate based on the following information:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(interviewReportSchema)
            }
        })

        console.log(JSON.parse(response.text))
    } catch (error) {
        console.error("Error generating interview report:", error);
    }
    
}

// export default {generateInterviewReport}