import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { setupDatabase } from '../utils/setupDatabase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  const fetchUserRole = async (userId) => {
    if (!userId) return null;
    
    try {
      // First check if user is a super admin
      const { data: superAdmin } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (superAdmin) return 'super_admin';
      
      // Check if user is an academy owner
      const { data: academyOwner } = await supabase
        .from('academy_owners')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (academyOwner) {
        setUserDetails(academyOwner);
        return 'academy_owner';
      }
      
      // Check if user is a teacher
      const { data: teacher } = await supabase
        .from('teachers')
        .select('*, academies(*)')
        .eq('user_id', userId)
        .single();
      
      if (teacher) {
        setUserDetails(teacher);
        return 'teacher';
      }
      
      // Check if user is a student
      const { data: student } = await supabase
        .from('students')
        .select('*, academies(*)')
        .eq('user_id', userId)
        .single();
      
      if (student) {
        setUserDetails(student);
        return 'student';
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize database tables if they don't exist
    const initDatabase = async () => {
      try {
        const result = await setupDatabase();
        setDbInitialized(result);
      } catch (error) {
        console.error('Error initializing database:', error);
        setDbInitialized(false);
      }
    };
    
    initDatabase();
    
    // Check for active session on mount
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      }
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else {
          setUserRole(null);
          setUserDetails(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setUserDetails(null);
  };
  
  // Register a new academy owner
  const registerAcademyOwner = async (email, password, fullName, academyName, contactNumber = null, academyAddress = null) => {
    try {
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        // Create a new academy
        const { data: academyData, error: academyError } = await supabase
          .from('academies')
          .insert([
            {
              name: academyName,
              owner_id: authData.user.id,
              address: academyAddress
            }
          ])
          .select();
        
        if (academyError) throw academyError;
        
        // Create academy owner record
        const { error: ownerError } = await supabase
          .from('academy_owners')
          .insert([
            {
              user_id: authData.user.id,
              name: fullName,
              email: email,
              contact_number: contactNumber,
              status: 'active'
            }
          ]);
        
        if (ownerError) throw ownerError;
        
        return { success: true, user: authData.user, academyId: academyData[0].id };
      }
    } catch (error) {
      console.error('Error registering academy owner:', error);
      return { success: false, error };
    }
  };
  
  // Register a new teacher
  const registerTeacher = async (email, password, fullName, academyId, specialization = null, experience = null, contactNumber = null) => {
    try {
      // Verify academy exists
      const { data: academyData, error: academyError } = await supabase
        .from('academies')
        .select('id')
        .eq('id', academyId)
        .single();
      
      if (academyError) throw new Error('Invalid Academy ID');
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        // Create teacher record
        const { error: teacherError } = await supabase
          .from('teachers')
          .insert([
            {
              user_id: authData.user.id,
              full_name: fullName,
              email: email,
              academy_id: academyId,
              specialization,
              experience,
              contact_number: contactNumber,
              status: 'pending'
            }
          ]);
        
        if (teacherError) throw teacherError;
        
        return { success: true, user: authData.user, status: 'pending' };
      }
    } catch (error) {
      console.error('Error registering teacher:', error);
      return { success: false, error };
    }
  };
  
  // Register a new student
  const registerStudent = async (email, password, fullName, academyId, gradeLevel = null, age = null, guardianContact = null) => {
    try {
      // Verify academy exists
      const { data: academyData, error: academyError } = await supabase
        .from('academies')
        .select('id')
        .eq('id', academyId)
        .single();
      
      if (academyError) throw new Error('Invalid Academy ID');
      
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        // Create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert([
            {
              user_id: authData.user.id,
              full_name: fullName,
              email: email,
              academy_id: academyId,
              grade_level: gradeLevel,
              age,
              guardian_contact: guardianContact,
              status: 'pending'
            }
          ]);
        
        if (studentError) throw studentError;
        
        return { success: true, user: authData.user, status: 'pending' };
      }
    } catch (error) {
      console.error('Error registering student:', error);
      return { success: false, error };
    }
  };
  
  // Fetch all academies for dropdown selection
  const fetchAcademies = async () => {
    try {
      const { data, error } = await supabase
        .from('academies')
        .select('id, name');
      
      if (error) throw error;
      
      return { success: true, academies: data };
    } catch (error) {
      console.error('Error fetching academies:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    userRole,
    userDetails,
    loading,
    signOut,
    registerAcademyOwner,
    registerTeacher,
    registerStudent,
    fetchAcademies,
    dbInitialized,
    isAuthenticated: !!user,
    isSuperAdmin: userRole === 'super_admin',
    isAcademyOwner: userRole === 'academy_owner',
    isTeacher: userRole === 'teacher',
    isStudent: userRole === 'student',
    isPending: user && !userRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};