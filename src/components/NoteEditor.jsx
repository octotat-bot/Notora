import { useState, useEffect, useRef, createPortal } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useNotification } from '../context/NotificationContext';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiList, 
  FiCheckSquare,
  FiImage,
  FiFile,
  FiSave,
  FiArchive,
  FiLock,
  FiX,
  FiTag,
  FiAlertTriangle
} from 'react-icons/fi';
import PinModal from './PinModal';
import NotebookSelector from './NotebookSelector';
const NoteEditor = ({ 
  mode = 'create',
  title: initialTitle = '',
  content: initialContent = '',
  selectedTags: initialTags = [],
  selectedNotebook: initialNotebook = null,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onNotebookChange,
  readOnly = false
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    notes, 
    archivedNotes, 
    lockedNotes,
    createNote, 
    updateNote,
    archiveNote,
    lockNote,
    isPinSet
  } = useNotes();
  const { showSuccess, showError } = useNotification();
  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');
  const [selectedTags, setSelectedTags] = useState(initialTags || []);
  const [selectedNotebook, setSelectedNotebook] = useState(initialNotebook || null);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  useEffect(() => {
    setTitle(initialTitle || '');
    setContent(initialContent || '');
    setSelectedTags(initialTags || []);
    setSelectedNotebook(initialNotebook || null);
  }, [initialTitle, initialContent, initialTags, initialNotebook]);
  useEffect(() => {
    if (!editorRef.current) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const newContent = editorRef.current.innerHTML;
          setContent(newContent);
          if (onContentChange) onContentChange(newContent);
        }
      });
    });
    observer.observe(editorRef.current, {
      childList: true,
      characterData: true,
      subtree: true
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!editorRef.current) return;
    const currentContent = editorRef.current.innerHTML;
    const newContent = initialContent || '';
    if (currentContent !== newContent) {
      editorRef.current.innerHTML = newContent;
    }
  }, [initialContent]);
  const handleSave = () => {
    setIsSaving(true);
    try {
      const currentContent = editorRef.current ? editorRef.current.innerHTML : content;
      if (mode === 'create') {
        const noteData = {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        };
        const newNote = createNote(noteData);
        navigate('/');
        showSuccess('Note created successfully!');
      } else if (mode === 'edit' && id) {
        updateNote(id, {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        });
        navigate('/');
        showSuccess('Note updated successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showError('Error saving note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
  const handleArchive = () => {
    setShowArchiveConfirmation(true);
  };
  const confirmArchive = () => {
    try {
      const currentContent = editorRef.current ? editorRef.current.innerHTML : content;
      if (mode === 'create') {
        const noteData = {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        };
        const newNote = createNote(noteData);
        archiveNote(newNote.id);
      } else if (mode === 'edit' && id) {
        updateNote(id, {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        });
        archiveNote(id);
      }
      showSuccess('Note archived successfully!');
      navigate('/archive');
      setShowArchiveConfirmation(false);
    } catch (error) {
      console.error('Error archiving note:', error);
      showError('Error archiving note. Please try again.');
      setShowArchiveConfirmation(false);
    }
  };
  const [showPinModal, setShowPinModal] = useState(false);
  const handleLock = () => {
    if (!isPinSet) {
      setShowPinModal(true);
      return;
    }
    try {
      const currentContent = editorRef.current ? editorRef.current.innerHTML : content;
      if (mode === 'create') {
        const noteData = {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        };
        const newNote = createNote(noteData);
        const result = lockNote(newNote);
        if (result.success) {
          showSuccess('Note locked successfully');
          navigate('/locked');
        } else {
          showError(result.message);
        }
      } else if (mode === 'edit' && id) {
        updateNote(id, {
          title,
          content: currentContent,
          notebookId: selectedNotebook,
          tagIds: selectedTags
        });
        const result = lockNote(id);
        if (result.success) {
          showSuccess('Note locked successfully');
          navigate('/locked');
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      console.error('Error locking note:', error);
      showError('Error locking note. Please try again.');
    }
  };
  const applyFormatting = (format) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    switch (format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      case 'orderedList':
        document.execCommand('insertOrderedList', false, null);
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'checkbox':
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        range.insertNode(checkbox);
        range.setStartAfter(checkbox);
        range.setEndAfter(checkbox);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      default:
        break;
    }
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onContentChange) onContentChange(newContent);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !editorRef.current) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.maxWidth = '100%';
      editorRef.current.focus();
      const selection = window.getSelection();
      let range;
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      } else {
        range = document.createRange();
        range.setStart(editorRef.current, editorRef.current.childNodes.length || 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onContentChange) onContentChange(newContent);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !editorRef.current) return;
    const fileLink = document.createElement('a');
    fileLink.textContent = `File: ${file.name}`;
    fileLink.href = '#';
    fileLink.className = 'attached-file';
    editorRef.current.focus();
    const selection = window.getSelection();
    let range;
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      range = document.createRange();
      range.setStart(editorRef.current, editorRef.current.childNodes.length || 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    range.insertNode(fileLink);
    range.setStartAfter(fileLink);
    range.setEndAfter(fileLink);
    selection.removeAllRanges();
    selection.addRange(range);
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    if (onContentChange) onContentChange(newContent);
    e.target.value = '';
  };
  const handlePinSetSuccess = () => {
    setShowPinModal(false);
    handleLock();
  };
  return (
    <div className="note-editor">
      {showPinModal && (
        <PinModal 
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          mode="set"
          onSuccess={handlePinSetSuccess}
        />
      )}
      <div className="editor-toolbar">
        <div className="formatting-buttons">
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('bold')}
            aria-label="Bold"
            title="Bold"
          >
            <FiBold />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('italic')}
            aria-label="Italic"
            title="Italic"
          >
            <FiItalic />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('underline')}
            aria-label="Underline"
            title="Underline"
          >
            <FiUnderline />
          </button>
        </div>
        <div className="toolbar-separator" />
        <div className="list-buttons">
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('orderedList')}
            aria-label="Numbered List"
            title="Numbered List"
          >
            <FiList />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('bulletList')}
            aria-label="Bullet List"
            title="Bullet List"
          >
            <FiList />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => applyFormatting('checkbox')}
            aria-label="Checkbox"
            title="Checkbox"
          >
            <FiCheckSquare />
          </button>
        </div>
        <div className="toolbar-separator" />
        <div className="insert-buttons">
          <label className="toolbar-button" aria-label="Insert Image" title="Insert Image">
            <FiImage />
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
      {showArchiveConfirmation && createPortal(
        <div className="confirmation-content" style={{ background: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '3px solid #ffff00', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000', padding: '16px', borderRadius: '8px', maxWidth: '350px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Archive Note</h3>
          <p>Are you sure you want to archive this note?</p>
          <div className="confirmation-actions" style={{ marginBottom: '0' }}>
            <button className="cancel-button" onClick={() => setShowArchiveConfirmation(false)}>
              <FiX /> Cancel
            </button>
            <button className="confirm-button" onClick={confirmArchive}>
              <FiArchive /> Archive
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default NoteEditor;