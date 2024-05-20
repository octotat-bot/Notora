import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useNotification } from '../context/NotificationContext';
import { FiArchive, FiTrash2, FiLock, FiEdit, FiMoreVertical, FiX, FiAlertTriangle, FiStar } from 'react-icons/fi';
import PinModal from './PinModal';
import { createPortal } from 'react-dom';
import '../styles/StickyNotes.css';
const NoteCard = ({ note, type = 'regular' }) => {
  const navigate = useNavigate();
  const { 
    archiveNote, 
    unarchiveNote, 
    deleteNote, 
    restoreNote, 
    lockNote,
    isPinSet,
    permanentlyDeleteNote,
    togglePinNote
  } = useNotes();
  const { showSuccess, showError, showInfo } = useNotification();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${dateStr}, ${timeStr}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };
  const getContentPreview = (content) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 
      ? `${plainText.substring(0, 100)}...` 
      : plainText;
  };
  const handleNoteClick = () => {
    if (type === 'regular' || type === 'archived') {
      navigate(`/edit/${note.id}`);
    } else if (type === 'locked') {
      navigate(`/locked/${note.id}`);
    }
  };
  const handleArchive = (e) => {
    e.stopPropagation();
    archiveNote(note.id);
  };
  const handleUnarchive = (e) => {
    e.stopPropagation();
    unarchiveNote(note.id);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNote(note.id);
  };
  const handleRestore = (e) => {
    e.stopPropagation();
    restoreNote(note.id);
  };
  const [showPinModal, setShowPinModal] = useState(false);
  const handleLock = (e) => {
    e.stopPropagation();
    if (isPinSet) {
      const result = lockNote(note.id);
      if (result.success) {
        showSuccess('Note locked successfully');
      } else {
        showError(result.message);
      }
    } else {
      setShowPinModal(true);
    }
  };
  const handlePinSetSuccess = () => {
    setShowPinModal(false);
    const result = lockNote(note.id);
    if (result.success) {
      showSuccess('Note locked successfully');
    } else {
      showError(result.message);
    }
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${note.id}`);
  };
  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };
  const handlePermanentDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
    setShowActions(false);
  };
  const confirmPermanentDelete = (e) => {
    e.stopPropagation();
    permanentlyDeleteNote(note.id);
    showInfo('Note permanently deleted');
    setShowDeleteConfirmation(false);
  };
  const cancelPermanentDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
  };
  const handleTogglePin = (e) => {
    e.stopPropagation();
    const result = togglePinNote(note.id);
    if (result.success) {
      showSuccess(result.isPinned ? 'Note pinned successfully' : 'Note unpinned');
    } else {
      showError(result.message);
    }
  };
  const [noteSize, setNoteSize] = useState('medium');
  useEffect(() => {
    const contentLength = (note.content || '').replace(/<[^>]*>/g, '').length;
    const titleLength = (note.title || '').length;
    const totalLength = contentLength + titleLength;
    if (totalLength < 80) {
      setNoteSize('small');
    } else if (totalLength < 250) {
      setNoteSize('medium');
    } else if (totalLength < 500) {
      setNoteSize('large');
    } else {
      setNoteSize('xlarge');
    }
  }, [note]);
  const getColor = () => {
    const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
    const charCode = note.id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  const getRotation = () => {
    const charSum = note.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (charSum % 7) - 3;
  };
  const color = getColor();
  const rotation = getRotation();
  return (
    <div 
      className={`sticky-note ${color} ${noteSize} ${note.isPinned ? 'pinned' : ''}`} 
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={handleNoteClick}
    >
      {showPinModal && (
        <PinModal 
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          mode="set"
          onSuccess={handlePinSetSuccess}
        />
      )}
      {note.isPinned && <div className="sticky-note-pin"></div>}
      <div className="sticky-note-header">
        <h3 className="sticky-note-title">{note.title || 'Untitled Note'}</h3>
        <div className="sticky-note-actions">
          <button 
            className="action-button"
            onClick={toggleActions}
            aria-label="More actions"
          >
            <FiMoreVertical />
          </button>
          {showActions && (
            <div className="actions-dropdown">
              {type === 'regular' && (
                <>
                  <button onClick={handleTogglePin}>
                    <FiStar /> {note.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={handleEdit}>
                    <FiEdit /> Edit
                  </button>
                  <button onClick={handleArchive}>
                    <FiArchive /> Archive
                  </button>
                  <button onClick={handleLock}>
                    <FiLock /> Lock
                  </button>
                  <button onClick={handleDelete}>
                    <FiTrash2 /> Delete
                  </button>
                </>
              )}
              {type === 'archived' && (
                <>
                  <button onClick={handleUnarchive}>
                    Unarchive
                  </button>
                  <button onClick={handleDelete}>
                    <FiTrash2 /> Delete
                  </button>
                </>
              )}
              {type === 'trash' && (
                <>
                  <button onClick={handleRestore}>
                    Restore
                  </button>
                  <button onClick={handlePermanentDelete}>
                    <FiTrash2 /> Delete Permanently
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="sticky-note-content-wrapper">
        <div className="sticky-note-content">
          {getContentPreview(note.content)}
        </div>
        <div className="sticky-note-date">
          {formatDate(note.updatedAt)}
        </div>
      </div>
      {showDeleteConfirmation && createPortal(
        <div 
          className="confirmation-content" 
          style={{ 
            background: '#ffffff', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
            border: '3px solid #ffff00', 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: '1000', 
            padding: '16px', 
            borderRadius: '8px', 
            maxWidth: '350px', 
            margin: '0 auto' 
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Delete Note</h3>
          <p>Are you sure you want to permanently delete this note? This action cannot be undone.</p>
          <div 
            className="confirmation-actions" 
            style={{ marginBottom: '0' }}
          >
            <button 
              className="cancel-button" 
              onClick={cancelPermanentDelete}
            >
              <FiX /> Cancel
            </button>
            <button 
              className="confirm-button" 
              onClick={confirmPermanentDelete}
            >
              <FiTrash2 /> Delete Permanently
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default NoteCard;