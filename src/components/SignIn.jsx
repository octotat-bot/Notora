import { SignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';
import '../styles/Auth.css';

const SignInPage = () => {
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
      <h2>Sign in to access premium features</h2>
      {intendedFeature && (
        <p className="auth-message">
          Sign in to access {intendedFeature === 'notebooks' ? 'Notebooks' : 'Locked Notes'}
        </p>
      )}
      <SignIn 
        signUpUrl="/sign-up" 
        redirectUrl={getRedirectUrl()}
        appearance={{
          elements: {
            formButtonPrimary: {
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3'
              }
            }
          }
        }}
      />
    </div>
  );
};

export default SignInPage;