import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import destinationRoute from "./routes/destination.js"
import foodRoute from "./routes/food.js"

dotenv.config()

BigInt.prototype.toJSON = function () {
    return this.toString()
}

const app = express()
const port = process.env.APP_PORT || 8080
const host = process.env.HOST || 'localhost'

app.use(express.json())
app.use(cors())

app.use('/destinations', destinationRoute)
app.use('/foods', foodRoute)

app.listen(port, host, () => {
    console.log(`server running on port ${port}`)
})