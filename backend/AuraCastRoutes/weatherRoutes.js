// weatherRoutes.js
import express from "express";
import {analyzeWeather} from "../AuraCastControllers/weatherController.js";
import {getLocationSuggestions} from "../AuraCastControllers/autocompleteController.js";

const weatherRouter = express.Router();
weatherRouter.post('/analyze', analyzeWeather);
export default weatherRouter;
