import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const getFoods = async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            include: {
                locations: {
                    include: {
                        location:
                            { select: { name: true, link: true } }
                    }
                }
            }
        })

        const result = foods.map(food => {
            return { ...food, locations: food.locations.map(loc => loc.location) }
        })

        res.status(200).json({
            data: { foods: result }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getFoodById = async (req, res) => {
    const { id } = req.params
    if (isNaN(parseInt(id)) && typeof id !== "boolean" && id !== null) {
        return res.status(400).json({ message: "Parameter id must be a number" })
    }

    try {
        const food = await prisma.food.findUnique({
            where: { id: id },
            include: {
                locations: {
                    include: {
                        location:
                            { select: { name: true, link: true } }
                    }
                }
            }
        })

        if (!food) {
            return res.status(404).json({ message: `Food with id ${id} not found` })
        }

        const result = { ...food, locations: food.locations.map(loc => loc.location) }
        res.status(200).json({
            data: {
                food: result
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getFoodsByName = async (req, res) => {
    const { name } = req.query
    if (!name) {
        return res.status(400).json({ message: "Parameter name required" })
    }

    try {
        const foods = await prisma.food.findMany({
            where: { name: { contains: name } },
            include: {
                locations: {
                    include: {
                        location:
                            { select: { name: true, link: true } }
                    }
                }
            }
        })

        const result = foods.map(food => {
            return { ...food, locations: food.locations.map(loc => loc.location) }
        })

        res.status(200).json({
            data: { foods: result }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export {
    getFoods,
    getFoodById,
    getFoodsByName
}