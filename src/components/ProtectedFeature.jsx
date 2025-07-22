import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedFeature = ({ children, feature }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // Store the feature they were trying to access
    sessionStorage.setItem('intendedFeature', feature);
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedFeature;