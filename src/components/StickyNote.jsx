import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiStar, FiTrash2, FiArchive, FiEdit2, FiAlertTriangle, FiX, FiLock } from 'react-icons/fi';
import '../styles/StickyNotes.css';
const StickyNote = ({ note, onPin, onArchive, onDelete, onClick, isDefault = false, isLocked = false }) => {
  const [noteSize, setNoteSize] = useState('medium');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const contentRef = useRef(null);
  const getColor = () => {
    const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
    const charCode = note.id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  const getRotation = () => {
    const charSum = note.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (charSum % 7) - 3;
  };
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
      return 'Date error';
    }
  };
  useEffect(() => {
    const contentLength = (note.content || '').replace(/<[^>]*>/g, '').length;
    const titleLength = (note.title || '').length;
    const totalLength = contentLength + titleLength;
    if (totalLength < 50) {
      setNoteSize('small');
    } else if (totalLength < 150) {
      setNoteSize('medium');
    } else if (totalLength < 300) {
      setNoteSize('large');
    } else {
      setNoteSize('xlarge');
    }
  }, [note]);
  const getPlainTextContent = () => {
    if (!note.content) return 'No content';
    const plainText = note.content.replace(/<[^>]*>/g, '');
    const maxLength = {
      'small': 60,
      'medium': 180,
      'large': 350,
      'xlarge': 500
    }[noteSize] || 180;
    return plainText.substring(0, maxLength) + (plainText.length > maxLength ? '...' : '');
  };
  const handleClick = (e) => {
    if (onClick) {
      onClick(note);
    }
  };
  const rotation = getRotation();
  const color = getColor();
  return (
    <div 
      className={`sticky-note ${color} ${noteSize} ${note.isPinned ? 'pinned' : ''} ${isDefault ? 'default-note' : ''} ${isLocked ? 'locked' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={handleClick}
    >
      {note.isPinned && <div className="sticky-note-pin"></div>}
      {isLocked && <div className="sticky-note-lock"><FiLock /></div>}
      <div className="sticky-note-header">
        <h3 className="sticky-note-title">{note.title || 'Untitled Note'}</h3>
        {!isDefault && (
          <div className="sticky-note-actions">
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                onPin && onPin(note.id);
              }}
              title={note.isPinned ? "Unpin" : "Pin"}
            >
              <FiStar className={note.isPinned ? "pinned" : ""} />
            </button>
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                onArchive && onArchive(note.id);
              }}
              title="Archive"
            >
              <FiArchive />
            </button>
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirmation(true);
              }}
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
      {isDefault ? (
        <div 
          className="sticky-note-content-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(note);
          }}
        >
          <div className="sticky-note-date">
            {formatDate(note.updatedAt)}
          </div>
          <div className="sticky-note-content" ref={contentRef}>
            {getPlainTextContent()}
          </div>
        </div>
      ) : (
        <Link 
          to={`/edit/${note.id}`}
          className="sticky-note-content-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky-note-date">
            {formatDate(note.updatedAt)}
          </div>
          <div className="sticky-note-content" ref={contentRef}>
            {getPlainTextContent()}
          </div>
        </Link>
      )}
      {showDeleteConfirmation && createPortal(
        <div className="confirmation-content" style={{ background: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '3px solid #ffff00', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000', padding: '16px', borderRadius: '8px', maxWidth: '350px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Delete Note</h3>
          <p>Are you sure you want to delete this note? This action will move the note to trash.</p>
          <div className="confirmation-actions" style={{ marginBottom: '0' }}>
            <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>
              <FiX /> Cancel
            </button>
            <button className="confirm-button" onClick={() => {
              onDelete && onDelete(note.id);
              setShowDeleteConfirmation(false);
            }}>
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default StickyNote;