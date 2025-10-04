// weatherRoutes.js
import express from "express";
import {analyzeWeather} from "../AuraCastControllers/weatherController.js";
import {getLocationSuggestions} from "../AuraCastControllers/autocompleteController.js";
import { analyzeTrip } from '../AuraCastControllers/tripController.js';

const weatherRouter = express.Router();
weatherRouter.post('/analyze', analyzeWeather);
weatherRouter.post('/trip/analyze', analyzeTrip);

export default weatherRouter;
