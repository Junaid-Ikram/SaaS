import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Ensure this path is correct

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
    // Flag to prevent multiple calls during initialization
    let isInitializing = true;
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change detected:', event, session);
      
      // Handle sign in events
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        setUser(session.user);
        setLoading(true); // Keep loading true until user details are fetched
        await fetchUserDetails(session.user.id);
        console.log('isPending after fetchUserDetails:', isPending);
        setLoading(false); // Set loading to false after user details are fetched
      } 
      // Handle sign out events
      else if (event === 'SIGNED_OUT') {
        console.log('User signed out event detected');
        setUser(null);
        setUserDetails(null);
        setUserRole(null);
        setIsPending(false);
        console.log('User states cleared due to sign out event');
        setLoading(false);
      }
    });

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session ? 'Session found' : 'No session');
        
        if (session) {
          setUser(session.user);
          await fetchUserDetails(session.user.id);
          console.log('Session check completed with user details fetched');
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
        isInitializing = false;
        console.log('Initial loading completed, loading state set to false');
      }
    };
    
    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      // Check for super_admin role
      console.log('Fetching user details for userId:', userId);

      // Check for super_admin role
      let { data: superAdminData, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (superAdminError && superAdminError.code !== 'PGRST116') {
        console.error('Error fetching super_admin:', superAdminError.message);
      }
      if (superAdminData) {
        console.log('Found super_admin data:', superAdminData);
        setUserDetails(superAdminData);
        setUserRole('super_admin');
        console.log('Super Admin Status:', superAdminData.status);
        const isPendingStatus = superAdminData.status === 'pending';
        setIsPending(isPendingStatus);
        console.log('Setting isPending to:', isPendingStatus);
        return;
      }

      // Check for academy_owner role
      let { data: academyOwnerData, error: academyOwnerError } = await supabase
        .from('academy_owners')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (academyOwnerError && academyOwnerError.code !== 'PGRST116') {
        console.error('Error fetching academy_owner:', academyOwnerError.message);
      }
      if (academyOwnerData) {
        console.log('Found academy_owner data:', academyOwnerData);
        setUserDetails(academyOwnerData);
        setUserRole('academy_owner');
        console.log('Academy Owner Status:', academyOwnerData.status);
        // Academy owners should always be active once created
        const isPendingStatus = false;
        setIsPending(isPendingStatus);
        console.log('Setting isPending to:', isPendingStatus);
        return;
      }

      // Check for teacher role
      let { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (teacherError && teacherError.code !== 'PGRST116') {
        console.error('Error fetching teacher:', teacherError.message);
      }
      if (teacherData) {
        console.log('Found teacher data:', teacherData);
        setUserDetails(teacherData);
        setUserRole('teacher');
        console.log('Teacher Status:', teacherData.status);
        const isPendingStatus = teacherData.status === 'pending';
        setIsPending(isPendingStatus);
        console.log('Setting isPending to:', isPendingStatus);
        return;
      }

      // Check for student role
      let { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (studentError && studentError.code !== 'PGRST116') {
        console.error('Error fetching student:', studentError.message);
      }
      if (studentData) {
        console.log('Found student data:', studentData);
        setUserDetails(studentData);
        setUserRole('student');
        console.log('Student Status:', studentData.status);
        const isPendingStatus = studentData.status === 'pending';
        setIsPending(isPendingStatus);
        console.log('Setting isPending to:', isPendingStatus);
        return;
      }

      console.log('No specific role found for user:', userId);
      // If no specific role found, default to 'user'
      setUserDetails(null);
      setUserRole('user');
      const isPendingStatus = false;
      setIsPending(isPendingStatus);
      console.log('Setting isPending to:', isPendingStatus, 'for default user role');
    } catch (error) {
      console.error('Exception fetching user details:', error.message);
      setUserDetails(null);
      setUserRole(null);
      const isPendingStatus = false;
      setIsPending(isPendingStatus);
      console.log('Setting isPending to:', isPendingStatus, 'due to error in fetchUserDetails');
    }
  };

  const registerAcademyOwner = async (email, password, fullName, academyName, contactNumber = null, academyAddress = null) => {
    try {
      // Check if email is already registered
      const { data: existingUsers, error: existingError } = await supabase
        .from('academy_owners')
        .select('email')
        .eq('email', email);

      if (existingError) {
        console.error('Error checking existing user:', existingError.message, existingError.details);
        throw existingError;
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, academy_name: academyName, role: 'academy_owner' },
        },
      });
      
      if (authError) {
        console.error('Auth error details:', authError);
        throw authError;
      }

      if (authData?.user) {
        // Create academy owner record
        const { error: ownerError } = await supabase
          .from('academy_owners')
          .insert([{ 
            user_id: authData.user.id, 
            full_name: fullName, 
            email, 
            phone: contactNumber, 
            status: 'active' 
          }]);
          
        if (ownerError) {
          console.error('Owner insertion error:', ownerError.message, ownerError.details);
          throw ownerError;
        }
        
        // Create academy record
        const { data: academyData, error: academyError } = await supabase
          .from('academies')
          .insert([{ 
            name: academyName, 
            owner_id: authData.user.id,
            address: academyAddress,
            status: 'active'
          }])
          .select();
          
        if (academyError) {
          console.error('Academy creation error:', academyError.message, academyError.details);
          throw academyError;
        }

        // Also update the users table with the role
        const { error: userUpdateError } = await supabase
          .from('users')
          .upsert([{
            id: authData.user.id,
            full_name: fullName,
            email,
            role: 'academy_owner'
          }]);

        if (userUpdateError) {
          console.error('User update error:', userUpdateError.message);
          throw userUpdateError;
        }
        
        console.log('Academy created successfully:', academyData);
        return { success: true, user: authData.user, academy: academyData?.[0] };
      }
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
      console.log('Registering teacher with email:', email);
      console.log('Academy ID:', academyId);
      
      // Check if email is already registered
      const { data: existingUsers, error: existingError } = await supabase
        .from('teachers')
        .select('email')
        .eq('email', email);

      if (existingError) {
        console.error('Error checking existing teacher:', existingError.message);
        throw existingError;
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'teacher' },
        },
      });
      
      if (authError) {
        console.error('Auth error details:', authError);
        throw authError;
      }

      if (authData?.user) {
        // Create teacher record with pending status
        const { error: teacherError } = await supabase
          .from('teachers')
          .insert([{ 
            user_id: authData.user.id, 
            full_name: fullName, 
            email, 
            phone: contactNumber,
            academy_id: academyId,
            subjects: specialization ? [specialization] : [],
            status: 'pending' // Set status to pending for academy owner approval
          }]);
          
        if (teacherError) {
          console.error('Teacher insertion error:', teacherError.message);
          throw teacherError;
        }

        // Also update the users table with the role
        const { error: userUpdateError } = await supabase
          .from('users')
          .upsert([{
            id: authData.user.id,
            full_name: fullName,
            email,
            role: 'teacher',
            academy_id: academyId
          }]);

        if (userUpdateError) {
          console.error('User update error:', userUpdateError.message);
          throw userUpdateError;
        }

        return { success: true, user: authData.user };
      }
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
      console.log('Registering student with email:', email);
      console.log('Academy ID:', academyId);
      
      // Check if email is already registered
      const { data: existingUsers, error: existingError } = await supabase
        .from('students')
        .select('email')
        .eq('email', email);

      if (existingError) {
        console.error('Error checking existing student:', existingError.message);
        throw existingError;
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: 'student' },
        },
      });
      
      if (authError) {
        console.error('Auth error details:', authError);
        throw authError;
      }

      if (authData?.user) {
        // Create student record with pending status
        const { error: studentError } = await supabase
          .from('students')
          .insert([{ 
            user_id: authData.user.id, 
            full_name: fullName, 
            email, 
            phone: guardianContact,
            academy_id: academyId,
            grade_level: gradeLevel,
            status: 'pending' // Set status to pending for academy owner approval
          }]);
          
        if (studentError) {
          console.error('Student insertion error:', studentError.message);
          throw studentError;
        }

        // Also update the users table with the role
        const { error: userUpdateError } = await supabase
          .from('users')
          .upsert([{
            id: authData.user.id,
            full_name: fullName,
            email,
            role: 'student',
            academy_id: academyId
          }]);

        if (userUpdateError) {
          console.error('User update error:', userUpdateError.message);
          throw userUpdateError;
        }

        return { success: true, user: authData.user };
      }
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
      console.log('Fetching academies...');
      
      // Fetch all academies regardless of status
      const { data, error } = await supabase
        .from('academies')
        .select('id, name, description, owner_id, status');
      
      if (error) {
        console.error('Error fetching academies:', error.message);
        throw error;
      }
      
      console.log('Academies fetched:', data);
      
      if (!data || data.length === 0) {
        console.log('No academies found');
      }
      
      return { success: true, academies: data || [] };
    } catch (error) {
      console.error('Exception fetching academies:', error.message);
      return { success: false, error: error.message || 'Failed to fetch academies' };
    }
  };

  const signOut = async () => {
    console.log('Attempting to sign out...');
    try {
      // First clear local state to prevent any race conditions
      setUser(null);
      setUserDetails(null);
      setUserRole(null);
      setIsPending(false);
      console.log('Local user states cleared.');
      
      // Then call Supabase signOut
      console.log('Calling supabase.auth.signOut()...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error.message);
        throw error;
      }
      
      console.log('Supabase sign out completed.');
      // Force a page reload to ensure all state is cleared
      window.location.href = '/';
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