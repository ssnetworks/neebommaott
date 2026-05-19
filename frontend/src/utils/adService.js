import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

const ADS_COLLECTION = 'advertisements';

const formatDriveImageUrl = (url) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    let fileId = null;
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) fileId = matchD[1];
    
    if (!fileId) {
      const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchId && matchId[1]) fileId = matchId[1];
    }
    
    if (fileId) {
      // For images, thumbnail works best. For video ads, we will handle formatting in the component.
      // But we will assume this is primarily for banner ads if it's an image.
      // For safety, we will just return the raw URL for ads and handle specific parsing in the frontend 
      // if it's a video vs image. But let's apply the thumbnail fix just in case it's a banner.
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  return url;
};

export const adService = {
  // Get all ads
  getAds: async (filters = {}) => {
    try {
      let q = collection(db, ADS_COLLECTION);
      
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.adType) {
        q = query(q, where('adType', '==', filters.adType));
      }
      
      const querySnapshot = await getDocs(q);
      const ads = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          // Only format as image if it's a banner ad
          mediaUrl: data.adType === 'banner' ? formatDriveImageUrl(data.mediaUrl) : data.mediaUrl
        };
      });
      
      ads.sort((a, b) => b.createdAt - a.createdAt);
      
      return ads;
    } catch (error) {
      console.error("Error getting ads:", error);
      throw error;
    }
  },

  // Get a single ad by ID
  getAdById: async (id) => {
    try {
      const docRef = doc(db, ADS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          _id: docSnap.id,
          ...data,
          mediaUrl: data.adType === 'banner' ? formatDriveImageUrl(data.mediaUrl) : data.mediaUrl
        };
      } else {
        throw new Error("Ad not found");
      }
    } catch (error) {
      console.error("Error getting ad:", error);
      throw error;
    }
  },

  // Create a new ad
  createAd: async (adData) => {
    try {
      const adToSave = {
        ...adData,
        clicks: 0,
        impressions: 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      const docRef = await addDoc(collection(db, ADS_COLLECTION), adToSave);
      return { _id: docRef.id, ...adToSave };
    } catch (error) {
      console.error("Error creating ad:", error);
      throw error;
    }
  },

  // Update an ad
  updateAd: async (id, adData) => {
    try {
      const docRef = doc(db, ADS_COLLECTION, id);
      const dataToUpdate = {
        ...adData,
        updatedAt: new Date().getTime()
      };
      await updateDoc(docRef, dataToUpdate);
      return { _id: id, ...dataToUpdate };
    } catch (error) {
      console.error("Error updating ad:", error);
      throw error;
    }
  },

  // Delete an ad
  deleteAd: async (id) => {
    try {
      const docRef = doc(db, ADS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting ad:", error);
      throw error;
    }
  },

  // Record an impression
  recordImpression: async (id) => {
    try {
      const docRef = doc(db, ADS_COLLECTION, id);
      await updateDoc(docRef, {
        impressions: increment(1)
      });
    } catch (error) {
      console.error("Error recording impression:", error);
    }
  },

  // Record a click
  recordClick: async (id) => {
    try {
      const docRef = doc(db, ADS_COLLECTION, id);
      await updateDoc(docRef, {
        clicks: increment(1)
      });
    } catch (error) {
      console.error("Error recording click:", error);
    }
  }
};
