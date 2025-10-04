// routes/awsFaceRoutes.js
import express from 'express';
import { getFacesByCollection,get_face_recognition_table1_data,deleteFaceFromCollection } from '../controllers/collectionItemController.js';



const collectionItemControllerRouter = express.Router();

collectionItemControllerRouter.get('/get-faces-by-bucket-collection', getFacesByCollection);
collectionItemControllerRouter.get('/get-face-recognition-table1-data', get_face_recognition_table1_data);
collectionItemControllerRouter.post('/delete-face-from-collection', deleteFaceFromCollection);

export default collectionItemControllerRouter;
