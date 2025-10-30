/**
 * Environment variables validation and type-safe access
 * Ensures all required environment variables are present at build time
 */

interface EnvVariables {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
  VITE_SUPER_ADMIN_IDS?: string;
}

function validateEnv(): EnvVariables {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ] as const;

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPER_ADMIN_IDS: import.meta.env.VITE_SUPER_ADMIN_IDS,
  };
}

// Validate on module load
export const env = validateEnv();

// Helper to check if user is super admin
export function isSuperAdmin(userId: string | undefined): boolean {
  if (!userId || !env.VITE_SUPER_ADMIN_IDS) return false;
  
  const adminIds = env.VITE_SUPER_ADMIN_IDS.split(',').map(id => id.trim());
  return adminIds.includes(userId);
}
