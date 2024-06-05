import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import { FiSearch, FiArchive } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
const ArchivePage = () => {
  const { archivedNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredNotes = archivedNotes.filter(note => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      note.content.toLowerCase().includes(lowerCaseQuery)
    );
  });
  return (
    <div className="archive-page">
      <div className="page-header">
        <h1>Archive</h1>
        <div className="header-actions">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
      </div>
      <div className="sticky-notes-container">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} type="archived" />
          ))
        ) : (
          <EmptyState 
            icon={<FiArchive />}
            title={searchQuery ? "No results found" : "No archived notes"}
            message={searchQuery ? `No archived notes found matching "${searchQuery}"` : "You haven't archived any notes yet"}
            action={searchQuery ? <button onClick={() => setSearchQuery('')}>Clear Search</button> : null}
          />
        )}
      </div>
    </div>
  );
};
export default ArchivePage;