import { account } from "../client";
import { Query, Models, ID } from "appwrite";

// Define user roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

interface UserWithRole extends Omit<Models.User<Models.Preferences>, 'labels'> {
  labels: string[];
}

export async function registerUser(username: string, email: string, password: string): Promise<UserWithRole> {
  try {
    // Create the user
    const user = await account.create(
      ID.unique(),
      email,
      password,
      username
    ) as UserWithRole;

    // Create a session immediately after registration
    await account.createEmailPasswordSession(email, password);
    
    // Get fresh user data with correct labels from server
    const freshUser = await getCurrentUser();
    
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(freshUser));
    localStorage.setItem("userId", freshUser.$id);
    
    return freshUser;
  } catch (error: any) {
    if (error.type === 'user_already_exists' || 
        error.message?.includes('unique') || 
        error.code === 409) {
      throw new Error('An account with this email already exists. Please try logging in instead.');
    }
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to create account. Please try again.');
  }
}

export const handleGoogleSignIn = async (): Promise<void> => {
  try {
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      // No existing session
    }
    // Use Homepage as callback URL
    const redirectUrl = `${window.location.origin}/Homepage`;
    await account.createOAuth2Session("google" as any, redirectUrl, redirectUrl);
  } catch (error) {
    console.error("Google Sign-In failed:", error);
  }
};

/**
 * Signs in a user and retrieves their roles.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The session object along with user and roles information.
 */
export const signIn = async (email: string, password: string): Promise<{
  session: Models.Session;
  userId: string;
}> => {
  try {
    // Delete existing session if any
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
      }
    } catch (error) {
      // No existing session
    }

    // Authenticate the user
    const session = await account.createEmailPasswordSession(email, password);
    
    // Get user details including roles
    const user = await getCurrentUser();
    
    // Store session and user data
    localStorage.setItem("authToken", session.$id);
    localStorage.setItem("userId", session.userId);
    localStorage.setItem("user", JSON.stringify({
      ...user,
      labels: Array.isArray(user.labels) ? user.labels : [] // Ensure labels is always an array
    }));

    return {
      session,
      userId: session.userId,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    // Try to get current session first
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
      }
    } catch (error) {
      // Session might not exist, which is fine
      console.log('No active session found');
    }
    
    // Clear all local storage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear storage even if session deletion fails
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }
};

export const getCurrentUser = async (): Promise<UserWithRole> => {
  try {
    const user = await account.get() as UserWithRole;
    // Ensure labels array exists and is properly typed
    user.labels = Array.isArray(user.labels) ? user.labels : [];
    return user;
  } catch (error) {
    throw error;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
};

export const sendPasswordRecoveryEmail = async (email: string): Promise<void> => {
  const resetPasswordUrl = `${window.location.origin}/reset-password`;
  try {
    await account.createRecovery(email, resetPasswordUrl);
  } catch (error) {
    throw error;
  }
};

export async function resetPassword(
  userId: string,
  secret: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  try {
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password do not match.");
    }
    await account.updateRecovery(userId, secret, newPassword);
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
}

export const isAdmin = (user: UserWithRole | null): boolean => {
  if (!user || !user.labels) return false;
  
  // Log for debugging
  console.log('Checking admin status:', {
    user: user.$id,
    labels: user.labels,
    isAdmin: user.labels.includes(ROLES.ADMIN)
  });
  
  // Strict check for admin role
  return Array.isArray(user.labels) && user.labels.includes(ROLES.ADMIN);
};