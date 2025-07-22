import React, { useState, useRef, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';

const SimpleNoteEditor = ({ 
  title: initialTitle = '',
  content: initialContent = '',
  onTitleChange,
  onContentChange,
  onSave,
  readOnly = false
}) => {
  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setTitle(initialTitle || '');
    setContent(initialContent || '');
  }, [initialTitle, initialContent]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) onTitleChange(newTitle);
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', padding: '10px', backgroundColor: '#f0f0f0', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            backgroundColor: '#4a90e2', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={handleTitleChange}
          readOnly={readOnly}
          style={{ 
            fontSize: '24px', 
            padding: '10px', 
            marginBottom: '20px', 
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        
        <div 
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ 
            flex: 1, 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: '#fffdf0',
            minHeight: '300px',
            lineHeight: '1.6'
          }}
        ></div>
      </div>
    </div>
  );
};

export default SimpleNoteEditor;