import { Router } from "express"
import {
    getNearbyLocation,
    searchDestinationByName,
    getDestinationBySlug
} from "../controllers/destinationController.js"

const destinationRoute = new Router()

destinationRoute.get('/nearby', getNearbyLocation)
destinationRoute.get('/search', searchDestinationByName)
destinationRoute.get('/:slug', getDestinationBySlug)

export default destinationRoute