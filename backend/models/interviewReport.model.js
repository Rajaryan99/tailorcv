import mongoose, { Schema } from "mongoose";


const technicalQuestionSchema = new Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention id required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const behaviouralQuestionSchema = new Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention id required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})


const skillGapSchema = new Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Serverity is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, 'Focus is required']
    },
    tasks:[ {
        type: String,
        required: [true, "task is required"]
    }]
})





const interviewReportSchema = new Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestion: [technicalQuestionSchema],
    behaviouralQuestion:[behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)
export default interviewReportModel;