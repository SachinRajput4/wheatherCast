// controllers/collectionController.js
import Collection from '../models/collectionModel.js';
import User1 from '../models/user1Model.js';
import User2 from '../models/user2Model.js';
import axios from 'axios';


const createCollection = async (req, res) => {
  try {
    const user2Id = req.user2Id;
    const { collectionId } = req.body;

    if (!collectionId || !user2Id) {
      return res.status(400).json({ error: 'collectionId and user2Id are required' });
    }

    // const existing = await Collection.findById(collectionId);
    // if (existing) {
    //   return res.status(409).json({ error: 'Collection with this ID already exists' });
    // }

    const taker = await User2.findById(user2Id);
    if (!taker) {
      return res.status(404).json({ error: 'Attendance taker not found' });
    }

    const newCollection = new Collection({
      collection_id: collectionId,
      user2Id: taker._id,
      students: [],
      attendanceRecords: {}
    });

    await newCollection.save();

    if (!Array.isArray(taker.collections)) {
      taker.collections = [];
    }
    taker.collections.push(newCollection._id);
    await taker.save();

    // 🔁 Replace fetch with axios
    try {
      const response2 = await axios.post(
        `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/create-collection`,
        { collection_id: newCollection._id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response2.status !== 200) {
        throw new Error(response2.data.error || "Failed to create collection in AWS");
      }
    } catch (awsErr) {
      console.error('AWS Lambda error:', awsErr.message);
      return res.status(500).json({ error: 'Failed to sync with AWS' });
    }

    return res.status(201).json({
      message: 'Collection created successfully',
      collectionId: newCollection._id
    });

  } catch (err) {
    console.error('Error creating collection:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


//deleteCollectionSoftly.js

const deleteCollectionSoftly = async (req, res) => {
  try {
    const user2Id = req.user2Id;
    const { collectionId } = req.body;

    if (!collectionId || !user2Id) {
      return res.status(400).json({ error: 'collectionId and user2Id are required' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.user2Id.toString() !== user2Id) {
      return res.status(403).json({ error: 'Not authorized to delete this collection' });
    }

    // ✅ Soft delete in MongoDB
    collection.deleted = true;
    await collection.save();

    // ✅ Remove from user's collection list (optional, or keep it)
    await User2.findByIdAndUpdate(user2Id, {
      $pull: { collections: collectionId }
    });

    return res.status(200).json({ message: 'Collection soft-deleted from MongoDB (AWS untouched)' });

  } catch (err) {
    console.error('Error in soft delete:', err);
    return res.status(500).json({ error: 'Server error while soft deleting collection' });
  }
};


//deleteCollectionPermanently.js

const deleteCollectionPermanently = async (req, res) => {
  try {
    const user2Id = req.user2Id;
    const { collectionId } = req.body;

    if (!collectionId || !user2Id) {
      return res.status(400).json({ error: 'collectionId and user2Id are required' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (collection.user2Id.toString() !== user2Id) {
      return res.status(403).json({ error: 'Not authorized to delete this collection' });
    }

    // 1. Delete from MongoDB
    await Collection.findByIdAndDelete(collectionId);

    // 2. Remove collectionId from the User2 document
    await User2.findByIdAndUpdate(user2Id, {
      $pull: { collections: collectionId }
    });

    // 3. Call AWS delete-collection Lambda
    try {
      const response = await axios.post(
        `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/delete-collection`,
        { collection_id: collectionId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status !== 200) {
        throw new Error('AWS deletion failed');
      }
    } catch (awsErr) {
      console.error('AWS delete error:', awsErr.message);
      return res.status(500).json({ error: 'Collection deleted locally, but failed to delete in AWS' });
    }

    return res.status(200).json({ message: 'Collection deleted successfully' });

  } catch (err) {
    console.error('Error deleting collection:', err);
    return res.status(500).json({ error: 'Server error while deleting collection' });
  }
};

// restore Coleection 
const restoreCollection = async (req, res) => {
  try {
    const user2Id = req.user2Id;
    const { collectionId } = req.body;

    if (!collectionId) {
      return res.status(400).json({ error: 'collectionId is required' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection || collection.user2Id.toString() !== user2Id) {
      return res.status(404).json({ error: 'Collection not found or unauthorized' });
    }

    if (!collection.deleted) {
      return res.status(400).json({ error: 'Collection is not deleted' });
    }

    collection.deleted = false;
    await collection.save();

    // Optionally re-add to user.collections if removed during delete
    await User2.findByIdAndUpdate(user2Id, {
      $addToSet: { collections: collectionId }
    });

    return res.status(200).json({ message: 'Collection restored successfully' });

  } catch (err) {
    console.error('Error restoring collection:', err);
    return res.status(500).json({ error: 'Server error while restoring collection' });
  }
};




const getCollections = async (req, res) => {
  try {
    const user2Id = req.user2Id;

    const collections = await Collection.find({ user2Id,deleted:false});
    return res.status(200).json({ collections });

  } catch (err) {
    console.error('Error fetching collections:', err);
    return res.status(500).json({ error: 'Server error while fetching collections' });
  }
};

const getDeletedCollections = async (req, res) => {
  const user2Id = req.user2Id;
  if (!user2Id) {
    return res.status(400).json({ error: 'User2 ID is required' });
  }
  // Fetch only deleted collections for the user

  const collections = await Collection.find({ user2Id:user2Id, deleted: true });
  return res.status(200).json({ collections });
};

const getUser1Collections = async (req, res) => {
  try {
    const user1Id = req.user1Id;  // assuming middleware sets this

    if (!user1Id) {
      return res.status(400).json({ error: "User1 ID is required" });
    }

    // Find collections where the students array includes this user1Id
    const collections = await Collection.find({ 
      students: user1Id, 
      deleted: false 
    }).populate('students', 'name email') // populate student info if needed
      .exec();

    return res.status(200).json({ collections });

  } catch (err) {
    console.error('Error fetching collections:', err);
    return res.status(500).json({ error: 'Server error while fetching collections' });
  }
};




export { createCollection, deleteCollectionSoftly, deleteCollectionPermanently, restoreCollection,getCollections,getDeletedCollections,getUser1Collections};



