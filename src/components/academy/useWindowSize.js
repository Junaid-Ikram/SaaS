import { useState, useEffect } from 'react';

// Custom hook to handle window resize events and track if the view is mobile
const useWindowSize = () => {
  // Initialize with default state (non-mobile)
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false
  });

  // Define the resize handler outside of useEffect to avoid recreating it on each render
  const handleResize = () => {
    // Update window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768 // Consider mobile if width is less than 768px
    });
  };

  useEffect(() => {
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  return windowSize;
};

export default useWindowSize;