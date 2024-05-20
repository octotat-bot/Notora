import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NotesContext';
import { FiBook, FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
import '../styles/NotebookSelector.css';
const NotebookSelector = ({ selectedNotebook, onNotebookChange }) => {
  const { notebooks, createNotebook } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewNotebookName('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsCreating(false);
    setNewNotebookName('');
  };
  const handleSelectNotebook = (notebookId) => {
    onNotebookChange(notebookId);
    setIsOpen(false);
  };
  const handleCreateClick = (e) => {
    e.stopPropagation();
    setIsCreating(true);
  };
  const handleCreateNotebook = (e) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;
    const newNotebook = createNotebook(newNotebookName);
    onNotebookChange(newNotebook.id);
    setNewNotebookName('');
    setIsCreating(false);
    setIsOpen(false);
  };
  const handleClearNotebook = (e) => {
    e.stopPropagation();
    onNotebookChange(null);
  };
  const currentNotebook = notebooks.find(notebook => notebook.id === selectedNotebook);
  return (
    <div className="notebook-selector" ref={dropdownRef}>
      <div className="notebook-selector-header" onClick={handleToggleDropdown}>
        <div className="notebook-selector-current">
          {selectedNotebook ? (
            <>
              <FiBook className="notebook-icon" />
              <span className="notebook-name">{currentNotebook?.name || 'Unknown Notebook'}</span>
              <button 
                className="clear-notebook-button" 
                onClick={handleClearNotebook}
                title="Remove from notebook"
              >
                <FiX />
              </button>
            </>
          ) : (
            <>
              <FiBook className="notebook-icon" />
              <span className="notebook-placeholder">Select Notebook</span>
            </>
          )}
        </div>
        <FiChevronDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className="notebook-dropdown">
          {isCreating ? (
            <form onSubmit={handleCreateNotebook} className="create-notebook-form">
              <input
                ref={inputRef}
                type="text"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                placeholder="New notebook name"
                className="new-notebook-input"
              />
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-button"
                  disabled={!newNotebookName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="notebook-list">
                {notebooks.length > 0 ? (
                  notebooks.map(notebook => (
                    <div
                      key={notebook.id}
                      className={`notebook-option ${selectedNotebook === notebook.id ? 'selected' : ''}`}
                      onClick={() => handleSelectNotebook(notebook.id)}
                    >
                      <FiBook className="notebook-icon" />
                      <span className="notebook-name">{notebook.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-notebooks">No notebooks available</div>
                )}
              </div>
              <div className="notebook-dropdown-footer">
                <button className="create-notebook-button" onClick={handleCreateClick}>
                  <FiPlus /> Create New Notebook
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default NotebookSelector;