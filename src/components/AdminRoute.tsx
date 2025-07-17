"use client";

import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/appwrite/auth";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isUserAdmin, setUser } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!user) {
          router.push('/login');
          return;
        }

        // Force a fresh check of user status from server
        const freshUser = await getCurrentUser();
        setUser(freshUser); // Update context with fresh user data

        // Strictly check for admin status
        if (!isUserAdmin) {
          console.log('Access denied: User is not an admin', {
            userId: freshUser.$id,
            labels: freshUser.labels
          });
          router.push('/Homepage');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/Homepage');
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [user, isUserAdmin, router, setUser]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Checking permissions...</h2>
          <p className="text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  // Show access denied message if not admin
  if (!user || !isUserAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access this area.</p>
          <p className="text-sm mt-2">This area is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  // Only render children if user is confirmed admin
  return <>{children}</>;
} 