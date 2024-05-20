import { useState, useRef, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { FiX, FiLock, FiShield, FiKey } from 'react-icons/fi';
import '../styles/PinModal.css';
const PinModal = ({ isOpen, onClose, mode = 'verify', onSuccess, noteId = null }) => {
  const { setNotePin, verifyPin, unlockNote } = useNotes();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [isConfirming, setIsConfirming] = useState(false);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  const confirmInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [isOpen]);
  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
  const handleConfirmPinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...confirmPin];
    newPin[index] = value;
    setConfirmPin(newPin);
    if (value && index < 3) {
      confirmInputRefs[index + 1].current.focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  const handleConfirmKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !confirmPin[index] && index > 0) {
      confirmInputRefs[index - 1].current.focus();
    }
  };
  const handleSubmit = () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    if (mode === 'set') {
      if (!isConfirming) {
        setIsConfirming(true);
        setConfirmPin(['', '', '', '']);
        setTimeout(() => {
          if (confirmInputRefs[0].current) {
            confirmInputRefs[0].current.focus();
          }
        }, 0);
      } else {
        const confirmPinString = confirmPin.join('');
        if (pinString !== confirmPinString) {
          setError('PINs do not match');
          return;
        }
        const result = setNotePin(pinString);
        if (result.success) {
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setError(result.message);
        }
      }
    } else if (mode === 'verify') {
      const isValid = verifyPin(pinString);
      if (isValid) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError('Incorrect PIN');
      }
    } else if (mode === 'unlock' && noteId) {
      const result = unlockNote(noteId, pinString);
      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    }
  };
  if (!isOpen) return null;
  return (
    <div className="lock-modal">
      <div className="lock-modal-content">
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>
        <div className="modal-icon">
          {mode === 'set' && <FiKey />}
          {mode === 'verify' && <FiShield />}
          {mode === 'unlock' && <FiLock />}
        </div>
        <h2>
          {mode === 'set' && !isConfirming && 'Set PIN'}
          {mode === 'set' && isConfirming && 'Confirm PIN'}
          {mode === 'verify' && 'Enter PIN'}
          {mode === 'unlock' && 'Unlock Note'}
        </h2>
        <p className="modal-description">
          {mode === 'set' && !isConfirming && 'Create a 4-digit PIN to secure your notes'}
          {mode === 'set' && isConfirming && 'Please re-enter your PIN to confirm'}
          {mode === 'verify' && 'Enter your PIN to access locked notes'}
          {mode === 'unlock' && 'Enter your PIN to unlock this note'}
        </p>
        {error && <p className="error-message">{error}</p>}
        {!isConfirming ? (
          <div className="pin-input">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="password"
                inputMode="numeric"
                className="pin-digit"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoComplete="off"
              />
            ))}
          </div>
        ) : (
          <div className="pin-input">
            {confirmPin.map((digit, index) => (
              <input
                key={index}
                ref={confirmInputRefs[index]}
                type="password"
                inputMode="numeric"
                className="pin-digit"
                maxLength={1}
                value={digit}
                onChange={(e) => handleConfirmPinChange(index, e.target.value)}
                onKeyDown={(e) => handleConfirmKeyDown(index, e)}
                autoComplete="off"
              />
            ))}
          </div>
        )}
        <button 
          className="submit-button"
          onClick={handleSubmit}
        >
          {mode === 'set' && !isConfirming && 'Next'}
          {mode === 'set' && isConfirming && 'Set PIN'}
          {mode === 'verify' && 'Verify'}
          {mode === 'unlock' && 'Unlock'}
        </button>
      </div>
    </div>
  );
};
export default PinModal;