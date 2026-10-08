import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";
import { resumeUpload } from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();


/**
 * @route POST /api/interview
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */

interviewRouter.post('/', authUser, resumeUpload, interviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/:id
 * @desc Get an interview report by ID.
 * @access Private
 */

interviewRouter.get('/report/:id', authUser, resumeUpload, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview
 * @desc Get all interview reports for the authenticated user.
 * @access Private  
 */

interviewRouter.get('/', authUser, interviewController.getAllInterviewReportsController)

interviewRouter.delete('/:id', authUser, interviewController.deleteInterviewReportController)

/**
 * @route GET /api/interview/resume/pdf
 * @description Generate a PDF of the candidate's resume based on the provided resume text, self-description, and job description.
 * @access Private
 */
 
interviewRouter.get('/resume/pdf/:interviewReportId', authUser, interviewController.generateResumePdfController)

export default interviewRouter;