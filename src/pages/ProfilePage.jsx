import { useState } from 'react';
import { FiUser, FiMail, FiSave, FiLock, FiUnlock, FiKey, FiShield } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext';
import { useNotes } from '../context/NotesContext';
import PinModal from '../components/PinModal';
import '../styles/ProfilePage.css';
const ProfilePage = () => {
  const { showSuccess, showError } = useNotification();
  const { isPinSet, setNotePin } = useNotes();
  const [username, setUsername] = useState('Guest User');
  const [email, setEmail] = useState('guest@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      showError('Username cannot be empty');
      return;
    }
    setIsSubmitting(true);
    try {
      setTimeout(() => {
        showSuccess('Profile updated successfully');
        setIsSubmitting(false);
      }, 500);
    } catch (err) {
      showError('An error occurred. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">
              <FiUser /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <FiMail /> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <button 
            type="submit" 
            className="profile-save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
      <div className="profile-stats">
        <div className="stats-card">
          <h3>Account Created</h3>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div className="stats-card pin-management">
          <h3>Note Security</h3>
          <p>{isPinSet ? 'PIN is set for locked notes' : 'No PIN set for note locking'}</p>
          <button 
            className="pin-button"
            onClick={() => setShowPinModal(true)}
          >
            {isPinSet ? (
              <>
                <FiLock /> Change PIN
              </>
            ) : (
              <>
                <FiUnlock /> Set PIN
              </>
            )}
          </button>
        </div>
      </div>
      {showPinModal && (
        <PinModal
          isOpen={showPinModal}
          mode="set"
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            showSuccess('PIN set successfully');
            setShowPinModal(false);
          }}
        />
      )}
    </div>
  );
};
export default ProfilePage;