import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { FiPlus, FiFileText, FiSearch, FiStar, FiArchive, FiTrash2, FiBook } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StickyNote from '../components/StickyNote';
import { v4 as uuidv4 } from 'uuid';
import '../styles/StickyNotes.css';
const HomePage = () => {
  const navigate = useNavigate();
  const { notes, archiveNote, deleteNote, togglePinNote, createNote, getNotesWithoutNotebook } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const createDefaultNote = () => {
    return {
      id: 'default-note',
      title: 'Create your first note',
      content: 'Welcome to Notora! Click the "New Note" button above or click on this note to start writing your thoughts and ideas.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notebookId: null,
      tagIds: [],
      isPinned: false,
      isDefault: true 
    };
  };
  const notesWithoutNotebook = getNotesWithoutNotebook();
  const notesToDisplay = notesWithoutNotebook.length === 0 && !searchQuery 
    ? [createDefaultNote()] 
    : notesWithoutNotebook;
  const filteredNotes = notesToDisplay.filter(note => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      note.content.toLowerCase().includes(lowerCaseQuery)
    );
  });
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  const getRandomColor = () => {
    const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const handleNoteClick = (note) => {
    if (note.isDefault) {
      navigate('/new');
    } else {
      navigate(`/edit/${note.id}`);
    }
  };
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>My Notes</h1>
        <div className="header-actions">
          <div className={isSearchFocused ? 'focused' : ''}>
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onClear={handleClearSearch} 
            />
          </div>
          <Link to="/new" className="new-note-button">
            <FiPlus /> New Note
          </Link>
        </div>
      </div>
      <div className="sticky-notes-wall">
        {filteredNotes.length > 0 ? (
          <>
            {pinnedNotes.length > 0 && (
              <div className="pinned-section">
                <div className="section-divider">
                  <h2><FiStar /> Pinned Notes</h2>
                </div>
                <div className="sticky-notes-container">
                  {pinnedNotes.map(note => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      onPin={note.isDefault ? null : (id) => togglePinNote(id)}
                      onArchive={note.isDefault ? null : (id) => archiveNote(id)}
                      onDelete={note.isDefault ? null : (id) => deleteNote(id)}
                      onClick={() => handleNoteClick(note)}
                      isDefault={note.isDefault}
                    />
                  ))}
                </div>
              </div>
            )}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="section-divider">
                    <h2>My Notes</h2>
                  </div>
                )}
                <div className="sticky-notes-container">
                  {unpinnedNotes.map(note => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      onPin={note.isDefault ? null : (id) => togglePinNote(id)}
                      onArchive={note.isDefault ? null : (id) => archiveNote(id)}
                      onDelete={note.isDefault ? null : (id) => deleteNote(id)}
                      onClick={() => handleNoteClick(note)}
                      isDefault={note.isDefault}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="notes-container">
            <EmptyState 
              icon={searchQuery ? <FiSearch size={40} /> : <FiFileText size={40} />}
              title={searchQuery ? "No results found" : "No notes yet"}
              message={searchQuery ? `No notes found matching "${searchQuery}"` : "Start capturing your ideas and thoughts"}
              action={searchQuery ? 
                <button className="clear-search-button" onClick={handleClearSearch}>Clear Search</button> : 
                <Link to="/new" className="create-first-note"><FiPlus /> Create your first note</Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;