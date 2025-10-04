// routes/awsSearchRoutes.js
import express from 'express';
import { searchFace, getSearchResults } from '../controllers/awsSearchController.js';
import user2Auth from '../middleware/user2Auth.js';


const awsSearchRouter = express.Router();

awsSearchRouter.post('/upload-face-image', user2Auth, searchFace);
awsSearchRouter.get('/fetch-search-results', user2Auth, getSearchResults);

export default awsSearchRouter;
