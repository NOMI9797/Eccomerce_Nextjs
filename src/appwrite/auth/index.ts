import { account } from "../client";
import { Query, Models } from "appwrite";

export async function registerUser(username: string, email: string, password: string): Promise<Models.User<Models.Preferences>> {
  const user = await account.create("unique()", email, password, username);
  localStorage.setItem("userId", user.$id);
  return user;
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
    const redirectUrl = `${window.location.origin}/auth`; // Your callback URL
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
      }
    } catch (error) {
      // No existing session
    }

    // Authenticate the user
    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem("authToken", session.$id);
    localStorage.setItem("userId", session.userId);

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
    await account.deleteSession('current');
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user-storage");
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<Models.User<Models.Preferences>> => {
  try {
    const user = await account.get();
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