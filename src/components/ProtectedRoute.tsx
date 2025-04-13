
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowDemo?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowDemo = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDemo = searchParams.get('demo') === 'true';
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-regime-dark text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-regime-green mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Allow access if user is authenticated or if demo mode is enabled and the route allows demo access
  if (!user && !(allowDemo && isDemo)) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
