import { supabase as sb } from './supabase';

/**
 * This script sets up the necessary database tables in Supabase
 * for the Academy Platform application if they don't already exist.
 */
import { supabase } from './supabase';

export const setupDatabase = async (setDatabaseInitialized) => {
  try {
    console.log('Setting up database tables...');
    
    // Check if tables exist by trying to query them
    const tablesExist = await checkTablesExist();
    
    if (tablesExist) {
      console.log('Database tables already exist');
    if (setDatabaseInitialized) {
      setDatabaseInitialized(true);
    }
    return true;
    }
    
    console.info('Tables do not exist. Please create them manually in Supabase Dashboard.');
    if (setDatabaseInitialized) {
      setDatabaseInitialized(false);
    }
    return false;
  } catch (error) {
    console.error('Error setting up database:', error);
    if (setDatabaseInitialized) {
      setDatabaseInitialized(false);
    }
    return false;
  }
};

// Check if tables exist by trying to query them
const checkTablesExist = async () => {
  const tables = ['users', 'academies', 'academy_owners', 'teachers', 'students', 'super_admins'];
  
  for (const table of tables) {
    try {
      const { error } = await sb
        .from(table)
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        console.info(`Table ${table} does not exist`);
        return false;
      }
    } catch (err) {
      console.log(`Error checking table ${table}:`, err);
      return false;
    }
  }
  
  return true;
};

// SQL to create tables - use this in Supabase SQL Editor
const SQL_CREATE_TABLES = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academy_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'academy_owner', 'teacher', 'student')),
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create academies table
CREATE TABLE IF NOT EXISTS public.academies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID NOT NULL,
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create academy_owners table
CREATE TABLE IF NOT EXISTS public.academy_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  academy_id UUID NOT NULL,
  subjects TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_academy FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  academy_id UUID NOT NULL,
  grade_level TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_academy FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE
);

-- Create super_admins table
CREATE TABLE IF NOT EXISTS public.super_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- Create basic policies (adjust as needed)
CREATE POLICY "Users can view their own academy" ON public.academies
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view their own data" ON public.academy_owners
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own data" ON public.teachers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own data" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own data" ON public.super_admins
  FOR SELECT USING (user_id = auth.uid());
`;