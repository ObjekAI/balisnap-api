import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

dotenv.config()

BigInt.prototype.toJSON = function () {
    return this.toString()
}

const app = express()
const port = process.env.APP_PORT || 8080
const host = process.env.HOST || 'localhost'
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/destinations/nearby', async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ error: 'Parameters required' });
    }

    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);
    const userRadius = parseInt(radius)

    try {
        const nearbyDestinations = await prisma.$queryRaw`
            SELECT
                id,
                name,
                slug,
                description,
                image,
                latitude,
                longitude,
                (6371 * acos(
                    cos(radians(${userLatitude}))
                    * cos(radians(latitude))
                    * cos(radians(longitude) - radians(${userLongitude}))
                    + sin(radians(${userLatitude}))
                    * sin(radians(latitude))
                )) AS distance,
                 created_at,
                 updated_at
            FROM
                destinations
            HAVING
                distance <= ${userRadius}
            ORDER BY
                distance;
        `

        res.json({
            data: {
                destinations: nearbyDestinations
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/destinations/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }

    try {
        const destinations = await prisma.destination.findMany({
            where: {
                name: {
                    contains: name,
                    // mode: Prisma.QueryMode.insensitive,
                },
            },
        });

        res.json({
            data: {
                destinations: destinations
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/destinations/:slug', async (req, res) => {
    const { slug } = req.params

    try {
        const destination = await prisma.destination.findUnique({
            where: { slug: slug }
        })

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        res.json({
            data: {
                destination: destination
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(port, host, () => {
    console.log(`server running on port ${port}`)
})