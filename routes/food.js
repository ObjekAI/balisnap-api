import { Router } from "express";
import {
    getFoods,
    getFoodById,
    getFoodsByName
} from "../controllers/foodController.js";

const foodRoute = new Router()

foodRoute.get('/', getFoods)
foodRoute.get('/search', getFoodsByName)
foodRoute.get('/:id', getFoodById)

export default foodRoute