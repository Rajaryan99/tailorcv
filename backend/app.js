import express from 'express'
import 'dotenv/config'
import connectDB from './db/db.js';

const app = express();

app.use(express.json())

const port = process.env.PORT

app.get('/',(req, res) => {

	res.send("Hello Wordl")
})

app.listen(port,() => {

	console.log(`server is running on http://localhost:${port}`)
	connectDB();
})
