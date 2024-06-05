import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { FiSearch, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
const TrashPage = () => {
  const { trashedNotes, restoreNote, permanentlyDeleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const filteredNotes = searchQuery 
    ? trashedNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : trashedNotes;
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  return (
    <div className="trash-page">
      <div className="page-header">
        <h1>Trash</h1>
        <div className="header-actions">
          <SearchBar 
            query={searchQuery} 
            onQueryChange={setSearchQuery} 
            isFocused={isSearchFocused}
            onFocusChange={setIsSearchFocused}
            placeholder="Search trashed notes..."
          />
        </div>
      </div>
      <div className="sticky-notes-container">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onRestore={restoreNote}
              onPermanentDelete={permanentlyDeleteNote}
              type="trash"
            />
          ))
        ) : (
          <EmptyState 
            icon={searchQuery ? <FiSearch size={40} /> : <FiTrash2 size={40} />}
            title={searchQuery ? "No results found" : "Trash is empty"}
            message={searchQuery ? `No trashed notes found matching "${searchQuery}"` : "Deleted notes will appear here"}
            action={searchQuery ? 
              <button className="clear-search-button" onClick={handleClearSearch}>Clear Search</button> : 
              null
            }
          />
        )}
      </div>
      {trashedNotes.length > 0 && (
        <div className="trash-info">
          <p>Notes in trash will be permanently deleted after 30 days</p>
        </div>
      )}
    </div>
  );
};
export default TrashPage;