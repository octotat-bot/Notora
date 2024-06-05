import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { createPortal } from 'react-dom';
import { FiSearch, FiLock, FiUnlock, FiArrowLeft, FiShield, FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StickyNote from '../components/StickyNote';
import PinModal from '../components/PinModal';
import '../styles/LockedNotesPage.css';
const LockedNotesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    notes, 
    lockedNotes, 
    unlockNote, 
    deleteNote, 
    deleteAllLockedNotes,
    isPinSet,
    verifyPin,
    pin
  } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  useEffect(() => {
    if (!isPinSet) {
      navigate('/profile');
    } else if (id) {
      const note = lockedNotes.find(n => n.id === id);
      if (note) {
        setCurrentNote(note);
        setShowPinModal(true);
      } else {
        navigate('/locked');
      }
    } else if (!isUnlocked) {
      setShowPinModal(true);
    }
  }, [id, isPinSet, lockedNotes, navigate, isUnlocked]);
  useEffect(() => {
    return () => {
      setIsUnlocked(false);
    };
  }, []);
  const filteredNotes = searchQuery 
    ? lockedNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lockedNotes;
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  const handleUnlockNote = () => {
    setShowPinModal(true);
    setCurrentNote(null);
  };
  const handleDeleteAll = () => {
    setShowDeleteConfirmation(true);
  };
  const confirmDeleteAll = () => {
    deleteAllLockedNotes();
    setShowDeleteConfirmation(false);
  };
  const cancelDeleteAll = () => {
    setShowDeleteConfirmation(false);
  };
  const handlePinSuccess = () => {
    setIsUnlocked(true);
    setShowPinModal(false);
    if (currentNote) {
      unlockNote(currentNote.id, pin);
      navigate(`/edit/${currentNote.id}`);
      setCurrentNote(null);
    }
  };
  const handleCloseModal = () => {
    setShowPinModal(false);
    setCurrentNote(null);
  };
  const goBack = () => {
    navigate('/locked');
  };
  const renderLockedNoteView = () => {
    return (
      <div className="locked-note-view">
        <button className="back-button" onClick={goBack}>
          <FiArrowLeft /> Back to Locked Notes
        </button>
        <div className="locked-note-container">
          <div className="locked-note-header">
            <h2>{currentNote.title}</h2>
            <p className="locked-date">Locked on {new Date(currentNote.lockedDate).toLocaleDateString()}</p>
          </div>
          <div className="locked-content-preview">
            <p>This note is locked. Unlock it to view and edit the content.</p>
          </div>
          <div className="locked-actions">
            <button className="unlock-button" onClick={() => setShowPinModal(true)}>
              <FiUnlock /> Unlock Note
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="locked-notes-page">
      <div className="page-header">
          <h1>Locked Notes</h1>
          <div className="header-actions">
            {!id && !isUnlocked && lockedNotes.length > 0 && (
              <button className="unlock-button" onClick={handleUnlockNote}>
                <FiUnlock /> Unlock
              </button>
            )}
            {lockedNotes.length > 0 && (
              <button 
                className="delete-all-button"
                onClick={handleDeleteAll}
                title="Delete All Locked Notes"
              >
                <FiTrash2 /> Delete All
              </button>
            )}
            <SearchBar 
              query={searchQuery} 
              onQueryChange={setSearchQuery} 
              isFocused={isSearchFocused}
              onFocusChange={setIsSearchFocused}
              placeholder="Search locked notes..."
            />
          </div>
        </div>
        <div className="content-area">
          {id && currentNote ? (
            renderLockedNoteView()
          ) : filteredNotes.length > 0 ? (
            <div className="sticky-notes-container">
              {filteredNotes.map(note => (
                <StickyNote
                  key={note.id}
                  note={note}
                  isLocked={true}
                  onClick={() => {
                    setCurrentNote(note);
                    setShowPinModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<FiLock size={40} />}
              title={searchQuery ? "No results found" : "No locked notes"}
              message={searchQuery ? `No locked notes found matching "${searchQuery}"` : "Locked notes will appear here"}
              action={searchQuery ? 
                <button className="clear-search-button" onClick={handleClearSearch}>Clear Search</button> : 
                null
              }
            />
          )}
        </div>
        {showPinModal && (
          <PinModal 
            isOpen={showPinModal}
            onClose={handleCloseModal} 
            mode="verify"
            onSuccess={handlePinSuccess}
            noteId={currentNote?.id}
          />
        )}
        {showDeleteConfirmation && createPortal(
          <div className="confirmation-content" style={{ background: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '3px solid #ffff00', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000', padding: '16px', borderRadius: '8px', maxWidth: '350px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Delete All Locked Notes</h3>
            <p>Are you sure you want to delete all locked notes? This action cannot be undone.</p>
            <div className="confirmation-actions" style={{ marginBottom: '0' }}>
              <button className="cancel-button" onClick={cancelDeleteAll}>
                <FiX /> Cancel
              </button>
              <button className="confirm-button" onClick={confirmDeleteAll}>
                <FiTrash2 /> Delete All
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
export default LockedNotesPage;