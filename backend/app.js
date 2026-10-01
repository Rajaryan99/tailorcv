import express from 'express'
import 'dotenv/config'
import connectDB from './db/db.js';
import authRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 3000

app.get('/',(req, res) => {

	res.send("Hello Wordl")
})



app.use('/api/auth', authRouter )

app.listen(port,() => {

	console.log(`server is running on http://localhost:${port}`)
	connectDB();
})
