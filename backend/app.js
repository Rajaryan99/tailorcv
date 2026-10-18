import express from 'express'
import 'dotenv/config'
import connectDB from './db/db.js';
import authRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import {resume, selfDescription, jobDescription} from './services/temp.js'
import {generateInterviewReport} from './services/ai.service.js'
import interviewRouter from './routes/interview.routes.js'



const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tailorcv-beta.vercel.app',
  'https://tailorcv.vercel.app'
];

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// generateInterviewReport({resume, selfDescription, jobDescription})
const port = process.env.PORT || 3000

app.get('/',(req, res) => {

	res.send("Hello Wordl")
})



app.use('/api/auth', authRouter )
app.use('/api/interview', interviewRouter )


app.listen(port,() => {

	console.log(`server is running on http://localhost:${port}`)
	connectDB();
})
