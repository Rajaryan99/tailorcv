import { PDFParse } from 'pdf-parse';
import {generateInterviewReport, generateResumePdf} from '../services/ai.service.js';
import interviewReportModel from '../models/interviewReport.model.js';

export function getUploadedResume(req) {
    return req.file ?? req.files?.resume?.[0] ?? req.files?.file?.[0] ?? req.files?.cv?.[0] ?? null;
}

function resolveUserId(req) {
    return req?.user?.id ?? req?.user?._id ?? null;
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

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: 'Self description and job description are required',
            });
        }

        const userId = resolveUserId(req);

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        let resumeText = '';

        if (uploadedResume) {
            const pdfParser = new PDFParse({ data: uploadedResume.buffer });
            const pdfContent = await pdfParser.getText();
            resumeText = pdfContent?.text?.trim() || '';
        } else {
            resumeText = selfDescription.trim();
        }

        if (!resumeText) {
            return res.status(400).json({
                message: 'Resume PDF or self description text is required',
            });
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
            title: interviewReportByAi.title || jobDescription,
            user: userId,
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


async function getAllInterviewReportsController(req, res) {
    try {
        const userId = resolveUserId(req);

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const interviewReports = await interviewReportModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .select('_id title createdAt');

        return res.status(200).json({
            message: 'All Interview Reports Retrieved Successfully',
            interviewReports,
        });
    } catch (error) {
        console.error('Error in getAllInterviewReportsController:', error);
        return res.status(500).json({ message: 'error in getAllInterviewReportsController' });
    }
}

async function deleteInterviewReportController(req, res) {
    try {
        const { id } = req.params;
        const userId = resolveUserId(req);

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const deletedReport = await interviewReportModel.findOneAndDelete({ _id: id, user: userId });

        if (!deletedReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }

        return res.status(200).json({
            message: 'Interview report deleted successfully',
            deletedReport,
        });
    } catch (error) {
        console.error('Error in deleteInterviewReportController:', error);
        return res.status(500).json({ message: 'error in deleteInterviewReportController' });
    }
}

/**
 * @description Export the interview report controllers for use in routes.
 */

async function generateResumePdfController(req, res) {
    const {interviewReportId} = req.params;

    try{
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }

        const {resume, selfDescription, jobDescription} = interviewReport;

        const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`,
            'Content-Length': pdfBuffer.length,
        })
        res.send(pdfBuffer);


    } catch (error) { 
        return res.status(500).json({ message: 'error in generateResumePdfController' });  
}
}

export default { generateInterviewReportController, getInterviewReportByIdController , getAllInterviewReportsController, deleteInterviewReportController, generateResumePdfController };