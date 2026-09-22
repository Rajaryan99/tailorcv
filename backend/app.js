import express from 'express'
import 'dotenv/config'

const app = express();

const port = process.env.PORT

app.get('/',(req, res) => {

	res.send("Hello Wordl")
})

app.listen(port,() => {

	console.log(`server is running on http://localhost:${port}`)
})
