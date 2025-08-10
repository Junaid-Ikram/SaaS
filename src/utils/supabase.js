// src/utils/supabase.js
// This file now provides dummy functionality instead of actual Supabase connection

// Create a dummy client object with methods that return dummy data
export const supabase = {
  auth: {
    signUp: async () => {
      console.log('Dummy signUp called');
      return { data: { user: { id: 'dummy-id' } }, error: null };
    },
    signIn: async () => {
      console.log('Dummy signIn called');
      return { data: { user: { id: 'dummy-id' } }, error: null };
    },
    signOut: async () => {
      console.log('Dummy signOut called');
      return { error: null };
    },
    getUser: async () => {
      console.log('Dummy getUser called');
      return { data: { user: null }, error: null };
    }
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: async () => {
          console.log(`Dummy select from ${table}`);
          return { data: null, error: null };
        },
        execute: async () => {
          console.log(`Dummy select from ${table}`);
          return { data: [], error: null };
        }
      })
    }),
    insert: () => ({
      execute: async () => {
        console.log(`Dummy insert into ${table}`);
        return { data: { id: 'dummy-id' }, error: null };
      }
    }),
    update: () => ({
      eq: () => ({
        execute: async () => {
          console.log(`Dummy update in ${table}`);
          return { data: { id: 'dummy-id' }, error: null };
        }
      })
    }),
    delete: () => ({
      eq: () => ({
        execute: async () => {
          console.log(`Dummy delete from ${table}`);
          return { data: null, error: null };
        }
      })
    })
  })
};