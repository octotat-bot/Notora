import React, { useState } from 'react';

const notebookPaperStyle = {
  width: '100%',
  minHeight: '400px',
  padding: '15px 15px 15px 40px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#fffdf0',
  lineHeight: '30px',
  fontFamily: 'Comic Sans MS, Arial, sans-serif',
  fontSize: '16px',
  backgroundImage: `
    linear-gradient(#e5e5e5 1px, transparent 1px),
    linear-gradient(90deg, transparent 30px, #ff9999 30px, #ff9999 31px, transparent 31px)
  `,
  backgroundSize: '100% 30px, 100% 100%',
  position: 'relative',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
};

const BasicNoteEditor = ({ 
  title: initialTitle = '',
  content: initialContent = '',
  onTitleChange,
  onContentChange,
  onSave
}) => {
  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) onTitleChange(newTitle);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onContentChange) onContentChange(newContent);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      if (onSave) {
        onSave({
          title,
          content
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = () => {
    if (onSave) {
      onSave({
        title,
        content,
        archive: true
      });
    }
  };

  const handleLock = () => {
    if (onSave) {
      onSave({
        title,
        content,
        lock: true
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={handleTitleChange}
          style={{ 
            width: '100%',
            fontSize: '24px', 
            padding: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Comic Sans MS, Arial, sans-serif',
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          placeholder="Start writing your note here..."
          value={content}
          onChange={handleContentChange}
          style={notebookPaperStyle}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            backgroundColor: '#4a90e2', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontSize: '18px' }}>💾</span> {isSaving ? 'Saving...' : 'Save Note'}
        </button>
        
        <button 
          onClick={handleArchive}
          style={{ 
            backgroundColor: '#f0ad4e', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontSize: '18px' }}>📦</span> Archive
        </button>
        
        <button 
          onClick={handleLock}
          style={{ 
            backgroundColor: '#5cb85c', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontSize: '18px' }}>🔒</span> Lock
        </button>
      </div>
    </div>
  );
};

export default BasicNoteEditor;