import { createClient } from "@supabase/supabase-js";

// Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

const isPlaceholder = !supabaseUrl || 
                      supabaseUrl.includes("placeholder") || 
                      !supabaseAnonKey || 
                      supabaseAnonKey.includes("placeholder");

// Define a function to create a completely safe mock client that never touches the network
function createMockSupabase() {
  const mockAuth = {
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    signUp: async ({ email }: any) => {
      return { data: { user: { id: "demo-user-id", email } }, error: null };
    },
    signInWithPassword: async ({ email }: any) => {
      return { data: { user: { id: "demo-user-id", email } }, error: null };
    },
    signOut: async () => {
      return { error: null };
    }
  };

  const createQueryChain = () => {
    const chain: any = {
      select: () => chain,
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => chain,
      delete: () => chain,
      eq: () => chain,
      single: () => Promise.resolve({ data: null, error: null }),
      then: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled)
    };
    return chain;
  };

  const mockClient: any = {
    auth: mockAuth,
    from: () => createQueryChain(),
  };

  // Add a fallback Proxy to handle any other unexpected calls safely
  return new Proxy(mockClient, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      if (prop === "then") return undefined;
      
      // Return a safe dummy function for anything else
      return () => {
        const dummy: any = () => dummy;
        dummy.then = (onfulfilled: any) => Promise.resolve({ data: null, error: null }).then(onfulfilled);
        return dummy;
      };
    }
  });
}

// If it's a placeholder, return the mock directly
let baseClient: any;
if (isPlaceholder) {
  baseClient = createMockSupabase();
} else {
  try {
    baseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    baseClient = createMockSupabase();
  }
}

// Wrap the client in a protective Proxy to intercept any network errors and return safe fallbacks
export const supabase = new Proxy(baseClient, {
  get(target, prop) {
    const val = target[prop];

    // Wrap functions to catch potential network errors (Failed to fetch)
    if (typeof val === "function") {
      return function (this: any, ...args: any[]) {
        try {
          const res = val.apply(this, args);
          if (res && typeof res.catch === "function") {
            // It's a promise, catch network fetch errors safely
            return res.catch((err: any) => {
              console.warn("Supabase Proxy caught a network/fetch error:", err);
              return { 
                data: null, 
                error: { 
                  message: err.message || "Failed to fetch", 
                  isNetworkError: true 
                } 
              };
            });
          }
          return res;
        } catch (err: any) {
          console.warn("Supabase Proxy caught an immediate error:", err);
          return Promise.resolve({ 
            data: null, 
            error: { 
              message: err.message || "Failed to fetch", 
              isNetworkError: true 
            } 
          });
        }
      };
    }

    // Intercept auth sub-properties
    if (prop === "auth") {
      return new Proxy(target.auth, {
        get(authTarget, authProp) {
          const authVal = authTarget[authProp];
          if (typeof authVal === "function") {
            return function (this: any, ...args: any[]) {
              try {
                const res = authVal.apply(this, args);
                if (res && typeof res.catch === "function") {
                  return res.catch((err: any) => {
                    console.warn("Supabase Auth Proxy caught fetch error:", err);
                    return { 
                      data: null, 
                      error: { 
                        message: err.message || "Failed to fetch", 
                        isNetworkError: true 
                      } 
                    };
                  });
                }
                return res;
              } catch (err: any) {
                console.warn("Supabase Auth Proxy caught immediate error:", err);
                return Promise.resolve({ 
                  data: null, 
                  error: { 
                    message: err.message || "Failed to fetch", 
                    isNetworkError: true 
                  } 
                });
              }
            };
          }
          return authVal;
        }
      });
    }

    // Intercept database query chains (from().select()...)
    if (prop === "from") {
      return function (this: any, ...args: any[]) {
        try {
          const queryChain = val.apply(this, args);
          
          // Helper to recursively wrap method calls in the builder chain
          const wrapChain = (chain: any): any => {
            return new Proxy(chain, {
              get(chainTarget, chainProp) {
                const chainVal = chainTarget[chainProp];
                
                // If it's a promise thenable (like when awaiting the query)
                if (chainProp === "then") {
                  return function (onfulfilled: any, onrejected: any) {
                    return chainTarget.then(
                      (res: any) => {
                        // Check if there is a fetch error returned by Supabase
                        if (res && res.error && (res.error.message === "Failed to fetch" || String(res.error).includes("fetch"))) {
                          console.warn("Intercepted fetch error in query response:", res.error);
                          return onfulfilled({ data: [], error: res.error });
                        }
                        return onfulfilled(res);
                      },
                      (err: any) => {
                        console.warn("Query promise rejected:", err);
                        return onfulfilled({ 
                          data: [], 
                          error: { message: err.message || "Failed to fetch", isNetworkError: true } 
                        });
                      }
                    );
                  };
                }

                if (typeof chainVal === "function") {
                  return function (this: any, ...chainArgs: any[]) {
                    try {
                      const nextChain = chainVal.apply(this, chainArgs);
                      return wrapChain(nextChain);
                    } catch (err: any) {
                      console.warn("Error in query builder:", err);
                      return wrapChain(Promise.resolve({ 
                        data: [], 
                        error: { message: err.message || "Failed to fetch", isNetworkError: true } 
                      }));
                    }
                  };
                }
                return chainVal;
              }
            });
          };

          return wrapChain(queryChain);
        } catch (err: any) {
          console.warn("Error initiating query:", err);
          return createMockSupabase().from("dummy");
        }
      };
    }

    return val;
  }
});

