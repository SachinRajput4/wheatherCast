// routes/collectionRoutes.js
import express from 'express';
import { createCollection, deleteCollectionPermanently,deleteCollectionSoftly,restoreCollection,getCollections,getDeletedCollections,getUser1Collections} from '../controllers/collectionController.js';
import user1Auth from '../middleware/user1Auth.js'
import user2Auth from '../middleware/user2Auth.js';

const CollectionRouter = express.Router();

CollectionRouter.post('/create-collection', user2Auth, createCollection);

CollectionRouter.delete('/delete-collection-softly', user2Auth, deleteCollectionSoftly);
CollectionRouter.delete('/delete-collection-permanently', user2Auth, deleteCollectionPermanently);
CollectionRouter.patch('/restore-collection', user2Auth, restoreCollection);
CollectionRouter.get('/get-collections', user2Auth, getCollections);
CollectionRouter.get('/get-deleted-collections',user2Auth, user2Auth, getDeletedCollections);

CollectionRouter.get('/get-user1-collections', user1Auth, getUser1Collections);


export default CollectionRouter;
