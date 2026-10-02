import express from 'express'
import 'dotenv/config'
import connectDB from './db/db.js';
import authRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
	origin: 'http://localhost:5173/',
	credentials: true
}))

const port = process.env.PORT || 3000

app.get('/',(req, res) => {

	res.send("Hello Wordl")
})



app.use('/api/auth', authRouter )

app.listen(port,() => {

	console.log(`server is running on http://localhost:${port}`)
	connectDB();
})
