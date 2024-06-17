import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const getNearbyLocation = async (req, res) => {
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
            WHERE
                latitude != ${userLatitude}
                AND longitude != ${userLongitude}
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
}

const searchDestinationByName = async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }

    try {
        const destinations = await prisma.destination.findMany({
            where: {
                name: {
                    contains: name,
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
}

const getDestinationBySlug = async (req, res) => {
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
}

export {
    getNearbyLocation,
    searchDestinationByName,
    getDestinationBySlug
}