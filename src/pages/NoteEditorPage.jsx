import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useNotification } from '../context/NotificationContext';
import NoteEditor from '../components/NoteEditor';
import { FiArrowLeft, FiSave, FiArchive, FiX } from 'react-icons/fi';
const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    notes, 
    archivedNotes, 
    lockedNotes,
    createNote, 
    updateNote, 
    archiveNote
  } = useNotes();
  const { showSuccess, showError, showInfo } = useNotification();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const notebookIdFromUrl = urlParams.get('notebookId');
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  useEffect(() => {
    const path = location.pathname;
    setViewMode(false);
  }, [location, id]);
  useEffect(() => {
    if (id === 'new') {
      setIsNew(true);
      setNote(null);
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setSelectedNotebook(notebookIdFromUrl || null);
      setIsLocked(false);
      return;
    }
    const allNotes = [...notes, ...archivedNotes, ...lockedNotes];
    const existingNote = allNotes.find(n => n.id === id);
    if (existingNote) {
      setIsNew(false);
      setNote(existingNote);
      setTitle(existingNote.title || '');
      if (existingNote.content !== undefined && existingNote.content !== null) {
        const contentStr = String(existingNote.content);
        setContent(contentStr);
      } else {
        setContent('');
      }
      setSelectedTags(existingNote.tagIds || []);
      setSelectedNotebook(existingNote.notebookId || null);
      setIsLocked(lockedNotes.some(n => n.id === id));
    } else {
      setIsNew(true);
      setNote(null);
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setSelectedNotebook(null);
      setIsLocked(false);
    }
  }, [id, notes, archivedNotes, lockedNotes, navigate, notebookIdFromUrl]);
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      navigate('/');
      return;
    }
    const noteData = {
      title: title.trim() || 'Untitled',
      content: content || '', 
      tagIds: selectedTags,
      notebookId: selectedNotebook,
      updatedAt: new Date().toISOString()
    };
    try {
      if (isNew) {
        const newNote = createNote(noteData);
        navigate('/');
        showSuccess('Note created successfully!');
      } else {
        updateNote(id, {
          title: title.trim() || 'Untitled',
          content: content || '', 
          tagIds: selectedTags,
          notebookId: selectedNotebook,
          updatedAt: new Date().toISOString()
        });
        navigate('/');
        showSuccess('Note updated successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showError('Error saving note. Please try again.');
    }
  };
  const handleBackClick = () => {
    if (!viewMode && (title.trim() || content.trim())) {
      setShowBackConfirmation(true);
    } else {
      navigate(-1);
    }
  };
  const confirmSaveAndLeave = () => {
    handleSave();
    setShowBackConfirmation(false);
  };
  const confirmLeaveWithoutSaving = () => {
    navigate('/');
    setShowBackConfirmation(false);
  };
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showBackConfirmation) {
        setShowBackConfirmation(false);
      }
    };
    if (showBackConfirmation) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showBackConfirmation]);
  return (
    <div className="note-editor-page">
      <div className="editor-header">
        <button className="back-button" onClick={handleBackClick}>
          <FiArrowLeft /> Back
        </button>
      </div>
      
      <NoteEditor 
        mode={id ? 'edit' : 'create'}
        noteId={id}
        onSave={handleSave}
        onArchive={handleArchive}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onUnsavedChanges={setHasUnsavedChanges}
      />
      
      {showBackConfirmation && (
        <div className="notification-dialog">
          <div className="confirmation-content">
            <h3>💾 Unsaved Changes</h3>
            <p>You have unsaved changes. What would you like to do?</p>
            <div className="confirmation-actions">
              <button className="cancel-button" onClick={confirmLeaveWithoutSaving}>
                <FiX /> Discard
              </button>
              <button className="confirm-button" onClick={confirmSaveAndLeave}>
                <FiSave /> Save & Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NoteEditorPage;