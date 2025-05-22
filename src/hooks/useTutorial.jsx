import { useState, useEffect } from 'react';
import { tutorialAPI, lessonAPI, technologyAPI } from '../services/api';

export const useTutorial = (tutorialId, lessonId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let tutorialData = null;
        let lessonsData = [];
        let currentLessonData = null;

        // If we have a tutorial ID, fetch the tutorial
        if (tutorialId) {
          const tutorialResponse = await tutorialAPI.getById(tutorialId);
          tutorialData = tutorialResponse.data;

          // Fetch lessons for this tutorial
          const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
          lessonsData = lessonsResponse.data || [];
        }

        // If we have a lesson ID, fetch the specific lesson
        if (lessonId) {
          const lessonResponse = await lessonAPI.getById(lessonId);
          currentLessonData = lessonResponse.data;

          // If we don't have tutorial data yet, get it from the lesson
          if (!tutorialData && currentLessonData.tutorial) {
            const tutorialId = currentLessonData.tutorial._id || currentLessonData.tutorial;
            const tutorialResponse = await tutorialAPI.getById(tutorialId);
            tutorialData = tutorialResponse.data;

            // Fetch all lessons for this tutorial
            const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
            lessonsData = lessonsResponse.data || [];
          }
        }

        // If we only have a topic ID (technology slug), fetch tutorials for that technology
        if (!tutorialId && !lessonId && tutorialId) {
          // This would be for cases like /tutorials/html
          try {
            // First try to get the technology
            const technologyResponse = await technologyAPI.getById(tutorialId);
            const technology = technologyResponse.data;
            
            // Then get tutorials for this technology
            const tutorialsResponse = await tutorialAPI.getAll({ 
              technology: technology._id 
            });
            const tutorials = tutorialsResponse.data.tutorials || tutorialsResponse.data;
            
            if (tutorials.length > 0) {
              // Use the first tutorial as default
              tutorialData = tutorials[0];
              
              // Get lessons for this tutorial
              const lessonsResponse = await lessonAPI.getByTutorial(tutorialData._id);
              lessonsData = lessonsResponse.data || [];
            }
          } catch (techError) {
            // If it's not a technology slug, try as tutorial ID directly
            console.log('Not a technology slug, treating as tutorial ID');
          }
        }
        
        setTutorial(tutorialData);
        setLessons(lessonsData);
        setCurrentLesson(currentLessonData);
        
      } catch (err) {
        console.error('Error fetching tutorial data:', err);
        setError(err.message || 'Failed to fetch tutorial data');
      } finally {
        setLoading(false);
      }
    };
    
    if (tutorialId || lessonId) {
      fetchTutorial();
    } else {
      setLoading(false);
    }
  }, [tutorialId, lessonId]);
  
  return { 
    tutorial, 
    lessons,
    currentLesson,
    loading, 
    error,
    refetch: () => {
      if (tutorialId || lessonId) {
        // Re-fetch data
        setLoading(true);
        // The useEffect will handle the refetch
      }
    }
  };
};

// Alternative hook for fetching tutorials by technology
export const useTutorialsByTechnology = (technologySlug) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [technology, setTechnology] = useState(null);
  
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get technology by slug
        const technologyResponse = await technologyAPI.getById(technologySlug);
        const technologyData = technologyResponse.data;
        setTechnology(technologyData);
        
        // Get tutorials for this technology
        const tutorialsResponse = await tutorialAPI.getAll({ 
          technology: technologyData._id 
        });
        const tutorialsData = tutorialsResponse.data.tutorials || tutorialsResponse.data;
        setTutorials(tutorialsData);
        
      } catch (err) {
        console.error('Error fetching tutorials by technology:', err);
        setError(err.message || 'Failed to fetch tutorials');
      } finally {
        setLoading(false);
      }
    };
    
    if (technologySlug) {
      fetchTutorials();
    }
  }, [technologySlug]);
  
  return { tutorials, technology, loading, error };
};

// Hook for fetching tutorials by domain
export const useTutorialsByDomain = (domainSlug) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [domain, setDomain] = useState(null);
  
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get domain by slug
        const domainResponse = await domainAPI.getById(domainSlug);
        const domainData = domainResponse.data;
        setDomain(domainData);
        
        // Get tutorials for this domain
        const tutorialsResponse = await tutorialAPI.getAll({ 
          domain: domainData._id 
        });
        const tutorialsData = tutorialsResponse.data.tutorials || tutorialsResponse.data;
        setTutorials(tutorialsData);
        
      } catch (err) {
        console.error('Error fetching tutorials by domain:', err);
        setError(err.message || 'Failed to fetch tutorials');
      } finally {
        setLoading(false);
      }
    };
    
    if (domainSlug) {
      fetchTutorials();
    }
  }, [domainSlug]);
  
  return { tutorials, domain, loading, error };
};

// Hook for tutorial navigation (prev/next lessons)
export const useTutorialNavigation = (tutorialId, currentLessonId) => {
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        if (!tutorialId) return;
        
        const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
        const lessonsData = lessonsResponse.data || [];
        
        // Sort lessons by order
        const sortedLessons = lessonsData.sort((a, b) => a.order - b.order);
        setLessons(sortedLessons);
        
        if (currentLessonId) {
          const index = sortedLessons.findIndex(lesson => lesson._id === currentLessonId);
          setCurrentIndex(index);
          
          // Set previous and next lessons
          setPrevLesson(index > 0 ? sortedLessons[index - 1] : null);
          setNextLesson(index < sortedLessons.length - 1 ? sortedLessons[index + 1] : null);
        }
        
      } catch (err) {
        console.error('Error fetching lesson navigation:', err);
      }
    };
    
    fetchLessons();
  }, [tutorialId, currentLessonId]);
  
  return {
    lessons,
    currentIndex,
    prevLesson,
    nextLesson,
    totalLessons: lessons.length
  };
};