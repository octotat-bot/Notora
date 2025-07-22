import { SignUp } from '@clerk/clerk-react';
import { useEffect } from 'react';
import '../styles/Auth.css';

const SignUpPage = () => {
  // Get the intended feature from session storage for redirect
  const intendedFeature = sessionStorage.getItem('intendedFeature');
  
  useEffect(() => {
    // Clear the intended feature when component unmounts
    return () => {
      sessionStorage.removeItem('intendedFeature');
    };
  }, []);

  // Determine redirect URL based on intended feature
  const getRedirectUrl = () => {
    if (intendedFeature === 'notebooks') return '/notebooks';
    if (intendedFeature === 'locked') return '/locked';
    return '/';
  };

  return (
    <div className="auth-container">
      <h2>Sign up to access premium features</h2>
      {intendedFeature && (
        <p className="auth-message">
          Sign up to access {intendedFeature === 'notebooks' ? 'Notebooks' : 'Locked Notes'}
        </p>
      )}
      <SignUp 
        signInUrl="/sign-in" 
        redirectUrl={getRedirectUrl()}
        appearance={{
          elements: {
            formButtonPrimary: {
              backgroundColor: '#28a745',
              '&:hover': {
                backgroundColor: '#1e7e34'
              }
            }
          }
        }}
      />
    </div>
  );
};

export default SignUpPage;
