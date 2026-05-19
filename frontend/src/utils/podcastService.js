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
  limit,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

const PODCASTS_COLLECTION = 'podcasts';

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
      return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
    }
  }
  return url;
};

export const podcastService = {
  getPodcasts: async (filters = {}) => {
    try {
      let q = collection(db, PODCASTS_COLLECTION);
      
      if (filters.isFeatured) {
        q = query(q, where('isFeatured', '==', true));
      }
      
      const querySnapshot = await getDocs(q);
      const podcasts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          coverImageUrl: formatDriveImageUrl(data.coverImageUrl)
        };
      });
      
      podcasts.sort((a, b) => b.createdAt - a.createdAt);
      
      return podcasts;
    } catch (error) {
      console.error("Error getting podcasts:", error);
      throw error;
    }
  },

  getPodcastById: async (id) => {
    try {
      const docRef = doc(db, PODCASTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          views: increment(1)
        });
        
        const data = docSnap.data();
        return {
          _id: docSnap.id,
          ...data,
          coverImageUrl: formatDriveImageUrl(data.coverImageUrl),
          views: (data.views || 0) + 1
        };
      } else {
        throw new Error("Podcast not found");
      }
    } catch (error) {
      console.error("Error getting podcast:", error);
      throw error;
    }
  },

  createPodcast: async (podcastData) => {
    try {
      const podcastToSave = {
        ...podcastData,
        views: 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      const docRef = await addDoc(collection(db, PODCASTS_COLLECTION), podcastToSave);
      return { _id: docRef.id, ...podcastToSave };
    } catch (error) {
      console.error("Error creating podcast:", error);
      throw error;
    }
  },

  updatePodcast: async (id, podcastData) => {
    try {
      const docRef = doc(db, PODCASTS_COLLECTION, id);
      const dataToUpdate = {
        ...podcastData,
        updatedAt: new Date().getTime()
      };
      await updateDoc(docRef, dataToUpdate);
      return { _id: id, ...dataToUpdate };
    } catch (error) {
      console.error("Error updating podcast:", error);
      throw error;
    }
  },

  deletePodcast: async (id) => {
    try {
      const docRef = doc(db, PODCASTS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting podcast:", error);
      throw error;
    }
  }
};
