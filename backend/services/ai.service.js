import { GoogleGenAI } from "@google/genai";
import * as z from 'zod'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

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
})).min(7).describe("A seven-day preparation plan for the candidate to improve their skills and prepare for the interview.")

})


export async function generateInterviewReport({resume, selfDescription, jobDescription}){


    const prompt = `Generate an interview report for a candidate based on the following information.
                        Return only JSON that exactly matches the provided response schema. Include at least 5 technical questions, 3 behavioural questions, and a 7-day preparation plan.
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // zod-to-json-schema generated an empty schema with installed Zod v4,
                // so Gemini had no field contract. Use Zod v4's native conversion.
                responseJsonSchema: z.toJSONSchema(interviewReportSchema)
            }
        })

        const report = JSON.parse(response.text)
        return interviewReportSchema.parse(report)
    } catch (error) {
        console.error("Error generating interview report:", error);
    }
    
}

export default generateInterviewReport
