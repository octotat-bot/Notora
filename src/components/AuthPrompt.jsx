import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser } from 'react-icons/fi';
import '../styles/AuthPrompt.css';

const AuthPrompt = ({ feature, message }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Store the intended feature for redirect after auth
    sessionStorage.setItem('intendedFeature', feature);
    navigate('/sign-in');
  };

  const handleSignUp = () => {
    // Store the intended feature for redirect after auth
    sessionStorage.setItem('intendedFeature', feature);
    navigate('/sign-up');
  };

  return (
    <div className="auth-prompt">
      <div className="auth-prompt-content">
        <FiLock size={48} className="auth-prompt-icon" />
        <h2>Authentication Required</h2>
        <p>{message || `Sign in to access ${feature}`}</p>
        <div className="auth-prompt-actions">
          <button onClick={handleSignIn} className="auth-btn sign-in-btn">
            <FiUser /> Sign In
          </button>
          <button onClick={handleSignUp} className="auth-btn sign-up-btn">
            <FiUser /> Sign Up
          </button>
        </div>
        <p className="auth-prompt-note">
          Create an account to unlock premium features like notebooks and locked notes.
        </p>
      </div>
    </div>
  );
};

export default AuthPrompt;
