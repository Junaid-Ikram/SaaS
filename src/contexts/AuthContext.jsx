import { createContext, useContext, useState, useEffect } from 'react';
// Using dummy data instead of Supabase
// import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Function to set dbInitialized status
  const setDatabaseInitialized = (status) => {
    setDbInitialized(status);
  };

  useEffect(() => {
    // Using dummy data instead of Supabase authentication
    console.log('Setting up dummy authentication');
    
    // Simulate a short delay to mimic authentication process
    const simulateAuth = async () => {
      try {
        // Create a dummy user
        const dummyUser = {
          id: '69123f68-b879-4b20-8a35-20746ed61a36',
          email: 'junaidikram17@gmail.com',
          user_metadata: { role: 'academy_owner' }
        };
        
        // Set the user after a short delay
        setTimeout(() => {
          console.log('Dummy user authenticated:', dummyUser.email);
          setUser(dummyUser);
          
          // Set dummy user details
          const dummyUserDetails = {
            id: 1,
            user_id: dummyUser.id,
            name: 'Junaid Ikram',
            email: dummyUser.email,
            academy_id: 1,
            status: 'active',
            created_at: '2023-01-01T00:00:00.000Z',
            role: 'academy_owner'
          };
          
          setUserDetails(dummyUserDetails);
          setUserRole('academy_owner');
          setIsPending(false);
          setLoading(false);
          console.log('Dummy user details set, loading complete');
        }, 3000); // 3000ms (3 seconds) delay to simulate network and show loading state
      } catch (error) {
        console.error('Error in dummy auth:', error);
        setLoading(false);
      }
    };
    
    simulateAuth();
    
    // No cleanup needed for dummy auth
    return () => {};
  }, []);

  // Dummy function to replace real database queries
  const fetchUserDetails = async (userId) => {
    try {
      console.log('Fetching dummy user details for userId:', userId);
      
      // This function is now just a placeholder since we're using dummy data
      // The actual user details are set directly in the useEffect
      console.log('Using dummy data instead of real database queries');
      
      // No need to do anything here as we set the user details in the useEffect
      return;
    } catch (error) {
      console.error('Exception in dummy fetchUserDetails:', error.message);
      // In a real app, we would handle errors properly
      // For now, we'll just log them
    }
  };

  const registerAcademyOwner = async (email, password, fullName, academyName, contactNumber = null, academyAddress = null) => {
    try {
      console.log('Registering dummy academy owner:', email);
      
      // Simulate checking if email is already registered
      const existingUsers = [];
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Create dummy user data
      console.log('Creating dummy user with email:', email);
      
      // Simulate a delay for registration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create dummy auth data
      const authData = {
        user: {
          id: 'dummy-user-id-' + Date.now(),
          email,
          user_metadata: { 
            full_name: fullName, 
            academy_name: academyName, 
            role: 'academy_owner' 
          }
        }
      };
      
      console.log('Dummy user created:', authData.user);
      
      // Create dummy academy owner record
      const dummyOwner = { 
        user_id: authData.user.id, 
        full_name: fullName, 
        email, 
        phone: contactNumber, 
        status: 'active' 
      };
      
      console.log('Dummy academy owner created:', dummyOwner);
      
      // Create dummy academy record
      const academyData = [{ 
        id: 'dummy-academy-id-' + Date.now(),
        name: academyName, 
        owner_id: authData.user.id,
        address: academyAddress,
        status: 'active'
      }];
      
      console.log('Dummy academy created:', academyData);

      // Simulate updating the users table with the role
      console.log('Simulating user update with role: academy_owner');
      
      console.log('Academy created successfully:', academyData);
      return { success: true, user: authData.user, academy: academyData?.[0] };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        details: error.details,
        code: error.code,
      });
      return { success: false, error };
    }
  };

  const registerTeacher = async (email, password, fullName, academyId, specialization = null, experience = null, contactNumber = null) => {
    try {
      console.log('Registering dummy teacher with email:', email);
      console.log('Academy ID:', academyId);
      
      // Simulate checking if email is already registered
      const existingUsers = [];
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Create dummy user data
      console.log('Creating dummy teacher with email:', email);
      
      // Simulate a delay for registration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create dummy auth data
      const authData = {
        user: {
          id: 'dummy-teacher-id-' + Date.now(),
          email,
          user_metadata: { 
            full_name: fullName, 
            role: 'teacher' 
          }
        }
      };
      
      console.log('Dummy teacher user created:', authData.user);
      
      // Create dummy teacher record
      const dummyTeacher = { 
        user_id: authData.user.id, 
        full_name: fullName, 
        email, 
        phone: contactNumber,
        academy_id: academyId,
        subjects: specialization ? [specialization] : [],
        status: 'pending' // Set status to pending for academy owner approval
      };
      
      console.log('Dummy teacher record created:', dummyTeacher);
      
      // Simulate updating the users table with the role
      console.log('Simulating user update with role: teacher');

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Teacher registration error:', {
        message: error.message,
        details: error.details,
        code: error.code,
      });
      return { success: false, error };
    }
  };

  const registerStudent = async (email, password, fullName, academyId, gradeLevel = null, age = null, guardianContact = null) => {
    try {
      console.log('Registering dummy student with email:', email);
      console.log('Academy ID:', academyId);
      
      // Simulate checking if email is already registered
      const existingUsers = [];
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Create dummy user data
      console.log('Creating dummy student with email:', email);
      
      // Simulate a delay for registration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create dummy auth data
      const authData = {
        user: {
          id: 'dummy-student-id-' + Date.now(),
          email,
          user_metadata: { 
            full_name: fullName, 
            role: 'student' 
          }
        }
      };
      
      console.log('Dummy student user created:', authData.user);
      
      // Create dummy student record
      const dummyStudent = { 
        user_id: authData.user.id, 
        full_name: fullName, 
            email, 
            phone: guardianContact,
            academy_id: academyId,
            grade_level: gradeLevel,
            status: 'pending' // Set status to pending for academy owner approval
          };
          
        console.log('Dummy student record created:', dummyStudent);
        
        // Simulate updating the users table with the role
        console.log('Simulating user update with role: student');

        return { success: true, user: authData.user };
    } catch (error) {
      console.error('Student registration error:', {
        message: error.message,
        details: error.details,
        code: error.code,
      });
      return { success: false, error };
    }
  };

  const fetchAcademies = async () => {
    try {
      console.log('Fetching dummy academies...');
      
      // Simulate a delay for network request
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Create dummy academies data
      const dummyAcademies = [
        {
          id: 1,
          name: 'Bright Future Academy',
          description: 'A premier institution for excellence in education',
          owner_id: '69123f68-b879-4b20-8a35-20746ed61a36',
          status: 'active'
        },
        {
          id: 2,
          name: 'Innovation Learning Center',
          description: 'Where innovation meets education',
          owner_id: 'dummy-owner-id-2',
          status: 'active'
        },
        {
          id: 3,
          name: 'Global Knowledge Academy',
          description: 'Preparing students for a global future',
          owner_id: 'dummy-owner-id-3',
          status: 'active'
        }
      ];
      
      console.log('Dummy academies data:', dummyAcademies);
      
      return { success: true, academies: dummyAcademies };
    } catch (error) {
      console.error('Exception fetching dummy academies:', error.message);
      return { success: false, error: error.message || 'Failed to fetch academies' };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('Dummy sign in with:', email);
      
      // Create a dummy user
      const dummyUser = {
        id: '69123f68-b879-4b20-8a35-20746ed61a36',
        email: email,
        user_metadata: { role: 'academy_owner' }
      };
      
      // Set the user after a short delay to simulate network
      setTimeout(() => {
        setUser(dummyUser);
        
        // Set dummy user details
        const dummyUserDetails = {
          id: 1,
          user_id: dummyUser.id,
          name: 'Junaid Ikram',
          email: dummyUser.email,
          academy_id: 1,
          status: 'active',
          created_at: '2023-01-01T00:00:00.000Z',
          role: 'academy_owner'
        };
        
        setUserDetails(dummyUserDetails);
        setUserRole('academy_owner');
        setIsPending(false);
        setLoading(false);
        console.log('Dummy user authenticated:', dummyUser.email);
      }, 500);
      
      return { data: { user: dummyUser }, error: null };
    } catch (error) {
      console.error('Error in dummy sign in:', error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('Attempting to sign out...');
    try {
      // Clear local state
      setUser(null);
      setUserDetails(null);
      setUserRole(null);
      setIsPending(false);
      setLoading(false);
      console.log('Local user states cleared.');
      
      console.log('Dummy sign out completed.');
      // Redirect to login page
      window.location.href = '/login';
      console.log('Sign out process finished.');
    } catch (error) {
      console.error('Error signing out:', error.message);
      // Even if there's an error, try to redirect to home
      window.location.href = '/';
    }
  };

  const value = {
    user,
    userDetails,
    userRole,
    loading,
    registerAcademyOwner,
    registerTeacher,
    registerStudent,
    fetchAcademies,
    fetchUserDetails, // Expose this if needed elsewhere
    signOut,
    dbInitialized,
    setDatabaseInitialized,
    isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);