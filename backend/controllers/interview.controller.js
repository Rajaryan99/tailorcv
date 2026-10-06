import { PDFParse } from 'pdf-parse';
import generateInterviewReport from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

export function getUploadedResume(req) {
    return req.file ?? req.files?.resume?.[0] ?? req.files?.file?.[0] ?? req.files?.cv?.[0] ?? null;
}

function normalizeInterviewReport(report = {}) {
    return {
        matchScore: report.matchingScore ?? report.matchScore ?? 0,
        technicalQuestion: Array.isArray(report.technicalQuestions)
            ? report.technicalQuestions.map((question) => ({
                question: question.question,
                intention: question.intention,
                answer: question.answer,
            }))
            : [],
        behaviouralQuestion: Array.isArray(report.behaviouralQuestions)
            ? report.behaviouralQuestions.map((question) => ({
                question: question.question,
                intention: question.intention,
                answer: question.answer,
            }))
            : [],
        skillGaps: Array.isArray(report.skillGaps)
            ? report.skillGaps.map((skill) => ({
                skill: skill.skill,
                severity: skill.serverity ?? skill.severity ?? 'medium',
            }))
            : [],
        preparationPlan: Array.isArray(report.preparationPlan)
            ? report.preparationPlan.map((plan) => ({
                day: plan.day,
                focus: plan.focus,
                tasks: Array.isArray(plan.tasks) ? plan.tasks : [],
            }))
            : [],
    };
}

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body || {};
        const uploadedResume = getUploadedResume(req);

        if (!uploadedResume) {
            return res.status(400).json({ message: 'Resume PDF is required' });
        }

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: 'Self description and job description are required',
            });
        }

        const pdfParser = new PDFParse({ data: uploadedResume.buffer });
        const resumeContent = await pdfParser.getText();
        const resumeText = resumeContent?.text?.trim() || '';

        if (!resumeText) {
            return res.status(400).json({ message: 'Unable to read text from the uploaded PDF' });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        if (!interviewReportByAi) {
            return res.status(500).json({ message: 'Failed to generate interview report' });
        }

        const interviewReport = await interviewReportModel.create({
            ...normalizeInterviewReport(interviewReportByAi),
            user: req.user?.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        return res.status(200).json({
            message: 'Interview Report Generated Successfully',
            interviewReportByAi,
            interviewReport,
        });
    } catch (error) {
        console.error('Error in generateInterviewReportController:', error);
        return res.status(500).json({ message: 'error in generateInterviewReportController' });
    }
}


/**
 * 
 * @desc Controller to get an interview report by interviewId.
 */


async function getInterviewReportByIdController(req, res) {
    try{

        const {id} = req.params;
        const interviewReport = await interviewReportModel.findById(id);

        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }

        return res.status(200).json({
            message: 'Interview Report Retrieved Successfully',
            interviewReport,
        });

    } catch (error) {
        console.error('Error in getInterviewReportByIdController:', error);
        return res.status(500).json({ message: 'error in getInterviewReportByIdController' });
    }
}

export default { generateInterviewReportController, getInterviewReportByIdController };