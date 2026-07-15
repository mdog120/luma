import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid keys are provided
const hasValidKeys = 
  supabaseUrl && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your_supabase_anon_key';

let supabase;

if (hasValidKeys) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // --- MOCK SUPABASE CLIENT (LOCAL STORAGE BACKEND) ---
  console.warn("Supabase credentials missing or default. Falling back to Local Storage guest/mock mode.");

  // Helper to get/set mock DB
  const getMockDB = () => {
    let db = localStorage.getItem('luma_mock_db');
    if (!db) {
      db = {
        users: {},       // email -> password & id
        profiles: {},    // user_id -> profile data
        unlocked: {},    // user_id -> array of items
        sessions: {},    // user_id -> array of session logs
        currentSession: null
      };
      localStorage.setItem('luma_mock_db', JSON.stringify(db));
    } else {
      db = JSON.parse(db);
    }
    return db;
  };

  const saveMockDB = (db) => {
    localStorage.setItem('luma_mock_db', JSON.stringify(db));
  };

  // Auth subscriptions callbacks
  const authCallbacks = [];

  const notifyAuthChange = (event, session) => {
    authCallbacks.forEach(cb => cb(event, session));
  };

  supabase = {
    isMock: true,
    auth: {
      signUp: async ({ email, password }) => {
        const db = getMockDB();
        if (db.users[email]) {
          return { data: { user: null }, error: { message: "User already exists." } };
        }
        
        const userId = 'mock-uid-' + Math.random().toString(36).substring(2, 9);
        db.users[email] = { password, id: userId };
        
        // Mock trigger: Create profile
        db.profiles[userId] = {
          id: userId,
          username: email.split('@')[0],
          coins: 100,
          high_score: 0,
          active_theme: 'default'
        };
        db.unlocked[userId] = [];
        db.sessions[userId] = [];
        
        const session = {
          access_token: 'mock-token',
          user: { id: userId, email }
        };
        db.currentSession = session;
        saveMockDB(db);

        notifyAuthChange('SIGNED_IN', session);
        return { data: { user: session.user, session }, error: null };
      },

      signInWithPassword: async ({ email, password }) => {
        const db = getMockDB();
        const user = db.users[email];
        if (!user || user.password !== password) {
          return { data: { user: null, session: null }, error: { message: "Invalid login credentials." } };
        }
        
        const session = {
          access_token: 'mock-token',
          user: { id: user.id, email }
        };
        db.currentSession = session;
        saveMockDB(db);

        notifyAuthChange('SIGNED_IN', session);
        return { data: { user: session.user, session }, error: null };
      },

      signOut: async () => {
        const db = getMockDB();
        db.currentSession = null;
        saveMockDB(db);
        notifyAuthChange('SIGNED_OUT', null);
        return { error: null };
      },

      getSession: async () => {
        const db = getMockDB();
        return { data: { session: db.currentSession }, error: null };
      },

      onAuthStateChange: (callback) => {
        authCallbacks.push(callback);
        // Fire once immediately
        const db = getMockDB();
        callback(db.currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', db.currentSession);
        
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const idx = authCallbacks.indexOf(callback);
                if (idx !== -1) authCallbacks.splice(idx, 1);
              }
            }
          }
        };
      }
    },

    from: (table) => {
      const db = getMockDB();
      const currentUserId = db.currentSession?.user?.id;

      return {
        select: (columns = '*') => {
          return {
            eq: (col, val) => {
              return {
                single: async () => {
                  if (!currentUserId) return { data: null, error: { message: "Not logged in" } };
                  
                  if (table === 'profiles') {
                    const profile = db.profiles[currentUserId];
                    return { data: profile || null, error: null };
                  }
                  return { data: null, error: { message: "Table not supported in mock single select" } };
                },
                then: async (resolve) => {
                  if (!currentUserId) return resolve({ data: [], error: { message: "Not logged in" } });

                  if (table === 'unlocked_items') {
                    const items = db.unlocked[currentUserId] || [];
                    return resolve({ data: items, error: null });
                  }
                  if (table === 'focus_sessions') {
                    const s = db.sessions[currentUserId] || [];
                    return resolve({ data: s, error: null });
                  }
                  return resolve({ data: [], error: null });
                }
              };
            },
            then: async (resolve) => {
              if (!currentUserId) return resolve({ data: [], error: { message: "Not logged in" } });
              
              if (table === 'profiles') {
                const profile = db.profiles[currentUserId];
                return resolve({ data: profile ? [profile] : [], error: null });
              }
              if (table === 'unlocked_items') {
                return resolve({ data: db.unlocked[currentUserId] || [], error: null });
              }
              if (table === 'focus_sessions') {
                return resolve({ data: db.sessions[currentUserId] || [], error: null });
              }
              return resolve({ data: [], error: null });
            }
          };
        },

        insert: (data) => {
          return {
            then: async (resolve) => {
              if (!currentUserId) return resolve({ data: null, error: { message: "Not logged in" } });
              
              const updatedDb = getMockDB();
              if (table === 'unlocked_items') {
                const list = updatedDb.unlocked[currentUserId] || [];
                // Check uniqueness
                if (!list.some(x => x.item_id === data.item_id)) {
                  list.push({ ...data, id: Date.now(), unlocked_at: new Date().toISOString() });
                  updatedDb.unlocked[currentUserId] = list;
                  saveMockDB(updatedDb);
                }
                return resolve({ data, error: null });
              }
              if (table === 'focus_sessions') {
                const list = updatedDb.sessions[currentUserId] || [];
                const newSession = { ...data, id: Date.now(), created_at: new Date().toISOString() };
                list.push(newSession);
                updatedDb.sessions[currentUserId] = list;
                saveMockDB(updatedDb);
                return resolve({ data: newSession, error: null });
              }
              return resolve({ data: null, error: null });
            }
          };
        },

        update: (data) => {
          return {
            eq: (col, val) => {
              return {
                then: async (resolve) => {
                  if (!currentUserId) return resolve({ data: null, error: { message: "Not logged in" } });

                  const updatedDb = getMockDB();
                  if (table === 'profiles') {
                    const profile = updatedDb.profiles[currentUserId];
                    if (profile) {
                      updatedDb.profiles[currentUserId] = { ...profile, ...data, updated_at: new Date().toISOString() };
                      saveMockDB(updatedDb);
                      return resolve({ data: updatedDb.profiles[currentUserId], error: null });
                    }
                  }
                  return resolve({ data: null, error: null });
                }
              };
            }
          };
        }
      };
    }
  };
}

export { supabase };
