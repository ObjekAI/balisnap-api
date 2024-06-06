import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.APP_PORT

app.get('/hello', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})