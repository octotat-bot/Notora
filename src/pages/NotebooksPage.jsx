import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useNotification } from '../context/NotificationContext';
import { createPortal } from 'react-dom';
import { FiBook, FiPlus, FiTrash2, FiAlertTriangle, FiX, FiEdit, FiCalendar, FiFileText, FiEdit2 } from 'react-icons/fi';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import StickyNote from '../components/StickyNote';
import '../styles/NotebooksPage.css';
const NotebooksPage = () => {
  const { notebooks, createNotebook, updateNotebook, deleteNotebook, getNotesByNotebook, togglePinNote, archiveNote, deleteNote } = useNotes();
  const { showSuccess, showError } = useNotification();
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [notebookFormVisible, setNotebookFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notebookName, setNotebookName] = useState('');
  const [notebookDescription, setNotebookDescription] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const resetForm = () => {
    setNotebookName('');
    setNotebookDescription('');
    setNotebookFormVisible(false);
    setIsEditing(false);
  };
  const handleCreateNotebook = () => {
    if (!notebookName.trim()) {
      showError('Notebook name cannot be empty');
      return;
    }
    try {
      createNotebook(notebookName, notebookDescription);
      showSuccess(`Notebook "${notebookName}" created successfully`);
      resetForm();
    } catch (error) {
      showError('Failed to create notebook');
      console.error(error);
    }
  };
  const handleUpdateNotebook = () => {
    if (!notebookName.trim() || !activeNotebook) {
      showError('Notebook name cannot be empty');
      return;
    }
    try {
      updateNotebook(activeNotebook.id, {
        name: notebookName,
        description: notebookDescription
      });
      showSuccess(`Notebook "${notebookName}" updated successfully`);
      resetForm();
    } catch (error) {
      showError('Failed to update notebook');
      console.error(error);
    }
  };
  const startEditNotebook = (notebook) => {
    setActiveNotebook(notebook);
    setNotebookName(notebook.name);
    setNotebookDescription(notebook.description || '');
    setIsEditing(true);
    setNotebookFormVisible(true);
  };
  const handleDeleteNotebook = (notebookId) => {
    try {
      deleteNotebook(notebookId);
      showSuccess('Notebook deleted successfully');
      if (activeNotebook && activeNotebook.id === notebookId) {
        setActiveNotebook(null);
      }
      setDeleteConfirmation(null);
    } catch (error) {
      showError('Failed to delete notebook');
      console.error(error);
    }
  };
  const notebookNotes = activeNotebook ? getNotesByNotebook(activeNotebook.id) : [];
  const getNotebookColor = (id) => {
    const colors = ['red', 'blue', 'green', 'purple', 'brown', 'teal'];
    const charCode = id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };
  return (
    <div className="notebooks-page">
      <div className="page-header">
          {notebooks.length === 0 ? (
            <h1>No Notebooks</h1>
          ) : (
            activeNotebook ? (
              <h1>
                {activeNotebook.name}
                <button 
                  className="edit-name-button"
                  onClick={() => startEditNotebook(activeNotebook)}
                  title="Edit notebook name"
                >
                  <FiEdit size={16} />
                </button>
              </h1>
            ) : (
              <h1>Notebooks</h1>
            )
          )}
          <div className="header-actions">
            {activeNotebook && (
              <button 
                className="delete-notebook-button"
                onClick={() => setDeleteConfirmation(activeNotebook.id)}
                title="Delete Notebook"
              >
                <FiTrash2 /> Delete Notebook
              </button>
            )}
            <button 
              className="new-notebook-button"
              onClick={() => {
                setNotebookFormVisible(true);
                setIsEditing(false);
              }}
            >
              <FiPlus /> New Notebook
            </button>
          </div>
        </div>
        <div className="content-area">
          {notebooks.length === 0 ? (
            <EmptyState 
              icon={<FiBook size={40} />}
              title="No notebooks yet"
              message="Create notebooks to organize your notes by topic or project"
              action={
                <button 
                  className="create-notebook-btn"
                  onClick={() => {
                    setNotebookFormVisible(true);
                    setIsEditing(false);
                  }}
                >
                  <FiPlus />
                  <span>Create Notebook</span>
                </button>
              }
            />
          ) : (
            activeNotebook ? (
              notebookNotes.length > 0 ? (
                <div className="sticky-notes-container">
                  {notebookNotes.map(note => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      onPin={(id) => togglePinNote(id)}
                      onArchive={(id) => archiveNote(id)}
                      onDelete={(id) => deleteNote(id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<FiFileText />}
                  title="No notes in this notebook"
                  message="Start adding notes to organize your thoughts"
                  action={
                    <Link to={`/new?notebookId=${activeNotebook.id}`} className="add-note-btn">
                      <FiPlus /> Create Note
                    </Link>
                  }
                />
              )
            ) : (
              <div className="notebooks-collection">
                {notebooks.map(notebook => {
                  const noteCount = getNotesByNotebook(notebook.id).length;
                  const color = getNotebookColor(notebook.id);
                  return (
                    <div 
                      key={notebook.id}
                      className={`notebook ${color}`}
                      onClick={() => setActiveNotebook(notebook)}
                    >
                      <div className="notebook-spine">
                        <span className="notebook-title">{notebook.name}</span>
                      </div>
                      <div className="notebook-cover">
                        <div className="notebook-info">
                          <h3>{notebook.name}</h3>
                          {notebook.description && (
                            <p className="notebook-description">{notebook.description}</p>
                          )}
                          <div className="notebook-meta">
                            <span className="notebook-date">
                              <FiCalendar /> {new Date(notebook.createdAt).toLocaleDateString()}
                            </span>
                            <span className="notebook-count">
                              <FiFileText /> {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                            </span>
                          </div>
                        </div>
                        <div className="notebook-actions">
                          <button 
                            className="notebook-action-btn edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditNotebook(notebook);
                            }}
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="notebook-action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation(notebook.id);
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
        {deleteConfirmation && createPortal(
          <div className="confirmation-content" style={{ background: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '3px solid #ffff00', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000', padding: '16px', borderRadius: '8px', maxWidth: '350px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Delete Notebook</h3>
            <p>Are you sure you want to delete this notebook? This action cannot be undone.</p>
            <p>Notes in this notebook will not be deleted.</p>
            <div className="confirmation-actions" style={{ marginBottom: '0' }}>
              <button className="cancel-button" onClick={() => setDeleteConfirmation(null)}>
                <FiX /> Cancel
              </button>
              <button className="confirm-button" onClick={() => handleDeleteNotebook(deleteConfirmation)}>
                <FiTrash2 /> Delete Notebook
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
export default NotebooksPage;