import express from 'express';
import jwt from 'jsonwebtoken';
const inviteStudentRouter = express.Router();
// const Collection = require('../models/Collection');
import {generateTokenLink,presignForUploadS3Index,addStudentToCollection,removeStudentFromCollection} from '../controllers/inviteStudentLinkController.js';
import verifyLinkToken from '../middleware/verifyLinkToken.js';
import user2Auth from '../middleware/user2Auth.js';
import user1Auth from '../middleware/user1Auth.js';
import {verifyLambdaKey} from '../middleware/verifyLambdaKey.js';


// Step 1: Sender generates link
inviteStudentRouter.post('/generate-link', user2Auth, generateTokenLink);
inviteStudentRouter.get('/verify-token',  verifyLinkToken);
inviteStudentRouter.get('/get-presigned-url', user1Auth, presignForUploadS3Index);
inviteStudentRouter.post('/add-student-in-mdb',verifyLambdaKey,addStudentToCollection);
inviteStudentRouter.post('/remove-student-in-mdb',verifyLambdaKey,removeStudentFromCollection);

export default inviteStudentRouter;




