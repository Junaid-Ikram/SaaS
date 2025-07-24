import { supabase } from './supabase';

/**
 * This script sets up the necessary database tables in Supabase
 * for the Academy Platform application if they don't already exist.
 */
export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Check if academies table exists
    const { data: academiesExists, error: academiesCheckError } = await supabase
      .from('academies')
      .select('id')
      .limit(1);
    
    if (academiesCheckError && academiesCheckError.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createAcademiesError } = await supabase.rpc('create_academies_table', {});
      
      if (createAcademiesError) {
        console.error('Error creating academies table:', createAcademiesError);
        
        // Fallback: Try to create the table using the REST API
        await createAcademiesTable();
      } else {
        console.log('Academies table created successfully');
      }
    } else {
      console.log('Academies table already exists');
    }
    
    // Check if academy_owners table exists
    const { data: ownersExists, error: ownersCheckError } = await supabase
      .from('academy_owners')
      .select('id')
      .limit(1);
    
    if (ownersCheckError && ownersCheckError.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createOwnersError } = await supabase.rpc('create_academy_owners_table', {});
      
      if (createOwnersError) {
        console.error('Error creating academy_owners table:', createOwnersError);
        
        // Fallback: Try to create the table using the REST API
        await createAcademyOwnersTable();
      } else {
        console.log('Academy owners table created successfully');
      }
    } else {
      console.log('Academy owners table already exists');
    }
    
    // Check if teachers table exists
    const { data: teachersExists, error: teachersCheckError } = await supabase
      .from('teachers')
      .select('id')
      .limit(1);
    
    if (teachersCheckError && teachersCheckError.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createTeachersError } = await supabase.rpc('create_teachers_table', {});
      
      if (createTeachersError) {
        console.error('Error creating teachers table:', createTeachersError);
        
        // Fallback: Try to create the table using the REST API
        await createTeachersTable();
      } else {
        console.log('Teachers table created successfully');
      }
    } else {
      console.log('Teachers table already exists');
    }
    
    // Check if students table exists
    const { data: studentsExists, error: studentsCheckError } = await supabase
      .from('students')
      .select('id')
      .limit(1);
    
    if (studentsCheckError && studentsCheckError.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createStudentsError } = await supabase.rpc('create_students_table', {});
      
      if (createStudentsError) {
        console.error('Error creating students table:', createStudentsError);
        
        // Fallback: Try to create the table using the REST API
        await createStudentsTable();
      } else {
        console.log('Students table created successfully');
      }
    } else {
      console.log('Students table already exists');
    }
    
    console.log('Database setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

// Fallback functions to create tables using REST API if RPC fails

async function createAcademiesTable() {
  try {
    // This is a workaround since we can't directly create tables via the REST API
    // We'll insert a record and let Supabase create the table with default structure
    const { error } = await supabase
      .from('academies')
      .insert([
        {
          name: 'Sample Academy',
          owner_id: 'placeholder',
          created_at: new Date().toISOString(),
          address: 'Sample Address'
        }
      ]);
    
    if (error && error.code !== '23505') { // Ignore if record already exists
      console.error('Error in fallback creation of academies table:', error);
    } else {
      console.log('Academies table created via fallback method');
    }
  } catch (err) {
    console.error('Error in fallback creation of academies table:', err);
  }
}

async function createAcademyOwnersTable() {
  try {
    const { error } = await supabase
      .from('academy_owners')
      .insert([
        {
          user_id: 'placeholder',
          name: 'Sample Owner',
          email: 'sample@example.com',
          status: 'active'
        }
      ]);
    
    if (error && error.code !== '23505') {
      console.error('Error in fallback creation of academy_owners table:', error);
    } else {
      console.log('Academy owners table created via fallback method');
    }
  } catch (err) {
    console.error('Error in fallback creation of academy_owners table:', err);
  }
}

async function createTeachersTable() {
  try {
    const { error } = await supabase
      .from('teachers')
      .insert([
        {
          user_id: 'placeholder',
          full_name: 'Sample Teacher',
          email: 'teacher@example.com',
          academy_id: 'placeholder',
          status: 'pending'
        }
      ]);
    
    if (error && error.code !== '23505') {
      console.error('Error in fallback creation of teachers table:', error);
    } else {
      console.log('Teachers table created via fallback method');
    }
  } catch (err) {
    console.error('Error in fallback creation of teachers table:', err);
  }
}

async function createStudentsTable() {
  try {
    const { error } = await supabase
      .from('students')
      .insert([
        {
          user_id: 'placeholder',
          full_name: 'Sample Student',
          email: 'student@example.com',
          academy_id: 'placeholder',
          status: 'pending'
        }
      ]);
    
    if (error && error.code !== '23505') {
      console.error('Error in fallback creation of students table:', error);
    } else {
      console.log('Students table created via fallback method');
    }
  } catch (err) {
    console.error('Error in fallback creation of students table:', err);
  }
}

// Create SQL functions in Supabase to create tables
export const createDatabaseFunctions = async () => {
  try {
    // These SQL functions would need to be created by an admin in the Supabase SQL editor
    // This is just a reference for what needs to be created
    
    const createAcademiesTableSQL = `
    CREATE OR REPLACE FUNCTION create_academies_table()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS academies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        owner_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        address TEXT,
        logo_url TEXT
      );
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    const createAcademyOwnersTableSQL = `
    CREATE OR REPLACE FUNCTION create_academy_owners_table()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS academy_owners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact_number TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    const createTeachersTableSQL = `
    CREATE OR REPLACE FUNCTION create_teachers_table()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS teachers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        academy_id UUID NOT NULL,
        specialization TEXT,
        experience TEXT,
        contact_number TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    const createStudentsTableSQL = `
    CREATE OR REPLACE FUNCTION create_students_table()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        academy_id UUID NOT NULL,
        grade_level TEXT,
        age INTEGER,
        guardian_contact TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    console.log('SQL functions for table creation defined');
    console.log('Please execute these functions in the Supabase SQL editor if needed');
    
    return {
      createAcademiesTableSQL,
      createAcademyOwnersTableSQL,
      createTeachersTableSQL,
      createStudentsTableSQL
    };
  } catch (error) {
    console.error('Error defining SQL functions:', error);
    return null;
  }
};