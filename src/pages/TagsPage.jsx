import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { FiPlus, FiX, FiEdit2, FiTag, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../components/EmptyState';
const TagsPage = () => {
  const { tags, notes, createTag, updateTag, deleteTag, getNotesByTag } = useNotes();
  const [selectedTag, setSelectedTag] = useState(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#ffd700');
  const [tagToDelete, setTagToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCreateTag = () => {
    if (!tagName.trim()) return;
    createTag(tagName, tagColor);
    setTagName('');
    setTagColor('#ffd700');
    setIsCreatingTag(false);
  };
  const handleUpdateTag = () => {
    if (!tagName.trim() || !selectedTag) return;
    updateTag(selectedTag.id, {
      name: tagName,
      color: tagColor
    });
    setTagName('');
    setTagColor('#ffd700');
    setIsEditingTag(false);
  };
  const handleDeleteTag = (tagId) => {
    setTagToDelete(tagId);
    setShowConfirmation(true);
  };
  const confirmDeleteTag = () => {
    deleteTag(tagToDelete);
    if (selectedTag && selectedTag.id === tagToDelete) {
      setSelectedTag(null);
    }
    setShowConfirmation(false);
    setTagToDelete(null);
  };
  const cancelDeleteTag = () => {
    setShowConfirmation(false);
    setTagToDelete(null);
  };
  const startEditTag = (tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setIsEditingTag(true);
  };
  const cancelTagAction = () => {
    setTagName('');
    setTagColor('#ffd700');
    setIsCreatingTag(false);
    setIsEditingTag(false);
  };
  const tagNotes = selectedTag ? getNotesByTag(selectedTag.id) : [];
  return (
    <div className="tags-page">
      <div className="page-header">
        <h1>Tags</h1>
        <button 
          className="new-tag-button"
          onClick={() => setIsCreatingTag(true)}
          disabled={isCreatingTag || isEditingTag}
        >
          <FiPlus /> New Tag
        </button>
      </div>
      <div className="tags-container">
        <div className="tags-list">
          {tags.map(tag => (
            <div 
              key={tag.id} 
              className={`tag-item ${selectedTag && selectedTag.id === tag.id ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              <div 
                className="tag-color" 
                style={{ backgroundColor: tag.color }}
              />
              <span className="tag-name">{tag.name}</span>
              <span className="tag-count">{getNotesByTag(tag.id).length}</span>
              <div className="tag-actions">
                <button 
                  className="edit-tag-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditTag(tag);
                  }}
                >
                  <FiEdit2 />
                </button>
                <button 
                  className="delete-tag-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag.id);
                  }}
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
          {tags.length === 0 && !isCreatingTag && (
            <EmptyState 
              icon={<FiTag />}
              title="No tags yet"
              message="Categorize your notes by creating tags"
              action={<button onClick={() => setIsCreatingTag(true)}>Create your first tag</button>}
            />
          )}
        </div>
        {isCreatingTag && (
          <div className="tag-form">
            <h2>Create New Tag</h2>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={tagName} 
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Tag name"
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="color" 
                value={tagColor} 
                onChange={(e) => setTagColor(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button onClick={cancelTagAction}>Cancel</button>
              <button onClick={handleCreateTag}>Create</button>
            </div>
          </div>
        )}
        {isEditingTag && selectedTag && (
          <div className="tag-form">
            <h2>Edit Tag</h2>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={tagName} 
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Tag name"
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="color" 
                value={tagColor} 
                onChange={(e) => setTagColor(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button onClick={cancelTagAction}>Cancel</button>
              <button onClick={handleUpdateTag}>Update</button>
            </div>
          </div>
        )}
        {selectedTag && !isEditingTag && (
          <div className="tag-notes">
            <h2>
              <span 
                className="tag-color-indicator" 
                style={{ backgroundColor: selectedTag.color }}
              />
              {selectedTag.name}
            </h2>
            <div className="sticky-notes-container">
              {tagNotes.length > 0 ? (
                tagNotes.map(note => (
                  <NoteCard key={note.id} note={note} type="regular" />
                ))
              ) : (
                <div className="empty-state">
                  <p>No notes with this tag</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showConfirmation && (
        <div className="confirmation-content" style={{ background: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '3px solid #ffff00', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000', padding: '16px', borderRadius: '8px', maxWidth: '350px', margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: '0' }}><FiAlertTriangle /> Delete Tag</h3>
          <p>Are you sure you want to delete this tag? Notes with this tag will remain in your notes list.</p>
          <div className="confirmation-actions" style={{ marginBottom: '0' }}>
            <button className="cancel-button" onClick={cancelDeleteTag}>
              <FiX /> Cancel
            </button>
            <button className="confirm-button" onClick={confirmDeleteTag}>
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TagsPage;