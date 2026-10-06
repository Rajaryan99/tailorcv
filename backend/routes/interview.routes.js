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

 

export default interviewRouter;