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

const MOVIES_COLLECTION = 'movies';

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
      return `https://lh3.googleusercontent.com/d/${fileId}=w1000`; // Appending =w1000 can help with sizing and caching
    }
  }
  return url;
};

export const movieService = {
  // Get all movies (can be filtered)
  getMovies: async (filters = {}) => {
    try {
      let q = collection(db, MOVIES_COLLECTION);
      
      // Basic filtering support
      if (filters.genre) {
        q = query(q, where('genre', 'array-contains', filters.genre));
      }
      if (filters.isFeatured) {
        q = query(q, where('isFeatured', '==', true));
      }
      
      // Note: Full text search is limited in Firestore without external tools like Algolia.
      // For simple "keyword" we will fetch all and filter in memory if needed, 
      // or just rely on exact title match if necessary.
      
      const querySnapshot = await getDocs(q);
      const movies = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          posterUrl: formatDriveImageUrl(data.posterUrl)
        };
      });
      
      // Sort in memory for simple implementation, normally use orderBy in query (requires indexes)
      movies.sort((a, b) => b.createdAt - a.createdAt);
      
      return movies;
    } catch (error) {
      console.error("Error getting movies:", error);
      throw error;
    }
  },

  // Get trending movies (sorted by views)
  getTrendingMovies: async () => {
    try {
      const q = query(collection(db, MOVIES_COLLECTION), orderBy('views', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          posterUrl: formatDriveImageUrl(data.posterUrl)
        };
      });
    } catch (error) {
      console.error("Error getting trending movies:", error);
      throw error;
    }
  },

  // Get a single movie by ID
  getMovieById: async (id) => {
    try {
      const docRef = doc(db, MOVIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Increment views
        await updateDoc(docRef, {
          views: increment(1)
        });
        
        const data = docSnap.data();
        return {
          _id: docSnap.id,
          ...data,
          posterUrl: formatDriveImageUrl(data.posterUrl),
          views: (data.views || 0) + 1
        };
      } else {
        throw new Error("Movie not found");
      }
    } catch (error) {
      console.error("Error getting movie:", error);
      throw error;
    }
  },

  // Create a new movie
  createMovie: async (movieData) => {
    try {
      const movieToSave = {
        ...movieData,
        views: 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      const docRef = await addDoc(collection(db, MOVIES_COLLECTION), movieToSave);
      return { _id: docRef.id, ...movieToSave };
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  // Update a movie
  updateMovie: async (id, movieData) => {
    try {
      const docRef = doc(db, MOVIES_COLLECTION, id);
      const dataToUpdate = {
        ...movieData,
        updatedAt: new Date().getTime()
      };
      await updateDoc(docRef, dataToUpdate);
      return { _id: id, ...dataToUpdate };
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  // Delete a movie
  deleteMovie: async (id) => {
    try {
      const docRef = doc(db, MOVIES_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },
  
  // Search movies (in-memory filtering since Firestore doesn't support native full-text search)
  searchMovies: async (keyword) => {
    try {
      const querySnapshot = await getDocs(collection(db, MOVIES_COLLECTION));
      const movies = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          posterUrl: formatDriveImageUrl(data.posterUrl)
        };
      });
      
      const searchLower = keyword.toLowerCase();
      return movies.filter(m => 
        m.title.toLowerCase().includes(searchLower) || 
        m.description.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  }
};
