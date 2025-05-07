import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notora-notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })
  
  const [trashNotes, setTrashNotes] = useState(() => {
    const savedTrash = localStorage.getItem('notora-trash')
    return savedTrash ? JSON.parse(savedTrash) : []
  })
  
  const [newNote, setNewNote] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [activeView, setActiveView] = useState('home')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmDeletePermanent, setConfirmDeletePermanent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('notora-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('notora-trash', JSON.stringify(trashNotes))
  }, [trashNotes])

  const handleAddNote = (e) => {
    e.preventDefault()
    if (newNote.trim() === '') return
    
    setNotes([...notes, {
      id: Date.now(),
      title: newTitle.trim() || 'Untitled Note',
      text: newNote,
      createdAt: new Date().toLocaleString()
    }])
    setNewNote('')
    setNewTitle('')
    setShowForm(false)
  }

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id)
    const updatedNotes = notes.filter(note => note.id !== id)
    
    setTrashNotes([...trashNotes, {
      ...noteToDelete,
      deletedAt: new Date().toLocaleString()
    }])
    
    setNotes(updatedNotes)
    setConfirmDelete(null)
  }

  const handleRestoreNote = (id) => {
    const noteToRestore = trashNotes.find(note => note.id === id)
    const updatedTrash = trashNotes.filter(note => note.id !== id)
    
    const { deletedAt, ...restoredNote } = noteToRestore
    
    setNotes([...notes, restoredNote])
    setTrashNotes(updatedTrash)
  }

  const handleDeletePermanent = (id) => {
    const updatedTrash = trashNotes.filter(note => note.id !== id)
    setTrashNotes(updatedTrash)
    setConfirmDeletePermanent(null)
  }

  const handleEmptyTrash = () => {
    setTrashNotes([])
    setConfirmDeletePermanent(null)
  }

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.text.toLowerCase().includes(searchLower)
    )
  })

  const renderPlaceholder = () => (
    <div className="feature-placeholder">
      <div className="placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path d="M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z" fill="currentColor" />
          <path fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" fill="currentColor" />
        </svg>
      </div>
      <h2>Coming Soon</h2>
      <p>This feature is currently under development and will be available in a future update.</p>
      <button className="primary-btn" onClick={() => setActiveView('home')}>Return to Notes</button>
    </div>
  )

  return (
    <div className="app">
      <div className="app-container">
        <div className="sidebar">
          <div className="sidebar-top">
            <div className="app-branding">
              <h2 className="app-name">Notora</h2>
            </div>
            
            <div className="sidebar-section">
              <button 
                className={`sidebar-btn ${activeView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('home')
                  setShowForm(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M11.03 2.59a1.501 1.501 0 011.94 0l7.5 6.363a1.5 1.5 0 01.53 1.144V19.5a1.5 1.5 0 01-1.5 1.5h-5.75a.75.75 0 01-.75-.75V14h-2v6.25a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5v-9.403c0-.44.194-.859.53-1.144l7.5-6.363zM12 3.734l-7.5 6.363V19.5h5v-6.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v6.25h5v-9.403l-7.5-6.363z" fill="currentColor" />
                </svg>
                Home
              </button>
              
              <button 
                className={`sidebar-btn ${activeView === 'notebooks' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('notebooks')
                  setShowForm(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M0 3.75C0 2.784.784 2 1.75 2h20.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0122.25 22H1.75A1.75 1.75 0 010 20.25V3.75zm1.75-.25a.25.25 0 00-.25.25v16.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H1.75z" fill="currentColor" />
                  <path d="M5 3.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H5.75A.75.75 0 015 3.25zm0 4a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H5.75A.75.75 0 015 7.25zm0 4a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H5.75a.75.75 0 01-.75-.75zm0 4a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H5.75a.75.75 0 01-.75-.75z" fill="currentColor" />
                </svg>
                Notebooks
              </button>
            </div>

            <div className="sidebar-section">
              <button 
                className={`sidebar-btn ${activeView === 'tags' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('tags')
                  setShowForm(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" fill="currentColor" />
                  <path fillRule="evenodd" d="M2.5 1A1.5 1.5 0 001 2.5v8.44c0 .397.158.779.44 1.06l10.25 10.25a1.5 1.5 0 002.12 0l8.44-8.44a1.5 1.5 0 000-2.12L12 1.44A1.5 1.5 0 0010.94 1H2.5zM2.5 2.5h8.44l10.25 10.25-8.44 8.44L2.5 10.94V2.5z" fill="currentColor" />
                </svg>
                Tags
              </button>
              
              <button 
                className={`sidebar-btn ${activeView === 'archive' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('archive')
                  setShowForm(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M3.5 3.75a.25.25 0 01.25-.25h13.5a.25.25 0 01.25.25v10a.75.75 0 001.5 0v-10A1.75 1.75 0 0017.25 2H3.75A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h7a.75.75 0 000-1.5h-7a.25.25 0 01-.25-.25V3.75z" fill="currentColor" />
                  <path d="M6.25 7a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm-.75 4.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm16.28 4.53a.75.75 0 10-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z" fill="currentColor" />
                </svg>
                Archive
              </button>
              
              <button 
                className={`sidebar-btn ${activeView === 'locked' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('locked')
                  setShowForm(false)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fillRule="evenodd" d="M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z" fill="currentColor" />
                </svg>
                Locked Notes
              </button>
            </div>
          </div>
          
          <div className="sidebar-bottom">
            <button 
              className={`sidebar-btn ${activeView === 'trash' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('trash')
                setShowForm(false)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0V3h5V1.75a.25.25 0 00-.25-.25h-4.5a.25.25 0 00-.25.25zM4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z" fill="currentColor" />
              </svg>
              Trash
              {trashNotes.length > 0 && <span className="badge">{trashNotes.length}</span>}
            </button>
            
            <button 
              className={`sidebar-btn add-note-btn ${showForm ? 'active' : ''}`}
              onClick={() => {
                setShowForm(true)
                setActiveView('home')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" fill="currentColor" />
              </svg>
              New Note
            </button>
          </div>
        </div>

        <div className="main-content">
          {showForm && (
            <form onSubmit={handleAddNote} className="note-form">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note title"
                className="note-title-input"
                autoFocus
              />
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note here..."
                rows="4"
                required
              />
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
                <button type="submit">Save Note</button>
              </div>
            </form>
          )}

          {activeView === 'home' && !showForm && (
            <>
              <div className="content-header">
                <h1>My Notes</h1>
                <div className="search-container">
                  <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fillRule="evenodd" d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z" fill="currentColor" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search" 
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z" fill="currentColor" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="notes-container">
                {searchQuery && (
                  <div className="search-results">
                    Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} for "{searchQuery}"
                  </div>
                )}
                <div className="notes-list">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map(note => (
                      <div key={note.id} className="note">
                        <div className="note-header">
                          <h3 className="note-title">{note.title}</h3>
                          <button 
                            className="delete-btn" 
                            onClick={() => setConfirmDelete(note.id)}
                            aria-label="Delete note"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0V3h5V1.75a.25.25 0 00-.25-.25h-4.5a.25.25 0 00-.25.25zM4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z" fill="currentColor" />
                              <path d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                        <p>{note.text}</p>
                        <div className="note-footer">
                          <small>{note.createdAt}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      {searchQuery ? (
                        <p>No notes found matching "{searchQuery}"</p>
                      ) : (
                        <p>No notes yet. Click "New Note" to get started!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeView === 'trash' && (
            <>
              <div className="trash-header">
                <h1>Trash</h1>
                {trashNotes.length > 0 && (
                  <button 
                    className="empty-trash-btn" 
                    onClick={() => setConfirmDeletePermanent('all')}
                  >
                    Empty Trash
                  </button>
                )}
              </div>
              
              <div className="notes-list">
                {trashNotes.length > 0 ? (
                  trashNotes.map(note => (
                    <div key={note.id} className="note trash-note">
                      <div className="note-header">
                        <h3 className="note-title">{note.title}</h3>
                        <div className="note-actions">
                          <button 
                            className="restore-btn" 
                            onClick={() => handleRestoreNote(note.id)}
                            aria-label="Restore note"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path d="M8.515 3.126A10.187 10.187 0 0112 2.587c4.31 0 8.116 2.731 9.49 6.744a1.526 1.526 0 010 1.338 10.211 10.211 0 01-5.618 5.727l1.665 1.664a.75.75 0 01-1.06 1.06L12.79 15.437a.75.75 0 01-.22-.53V10.25a.75.75 0 011.5 0v2.69a8.677 8.677 0 004.973-4.773.276.276 0 000-.334A8.678 8.678 0 0012 4.087a8.678 8.678 0 00-7.243 3.746.276.276 0 000 .334 8.629 8.629 0 001.397 1.748.75.75 0 01-1.061 1.061A10.172 10.172 0 013.51 9.33a1.526 1.526 0 010-1.338 10.189 10.189 0 015.005-4.866z" fill="currentColor" />
                            </svg>
                          </button>
                          <button 
                            className="delete-permanent-btn" 
                            onClick={() => setConfirmDeletePermanent(note.id)}
                            aria-label="Delete permanently"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                              <path d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0V3h5V1.75a.25.25 0 00-.25-.25h-4.5a.25.25 0 00-.25.25zM4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z" fill="currentColor" />
                              <path d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p>{note.text}</p>
                      <div className="note-footer trash-footer">
                        <small>Created: {note.createdAt}</small>
                        <small>Deleted: {note.deletedAt}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Trash is empty.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {(activeView === 'tags' || 
            activeView === 'archive' || 
            activeView === 'notebooks' || 
            activeView === 'locked') && renderPlaceholder()}

          {confirmDelete && (
            <div className="modal-overlay">
              <div className="delete-modal">
                <h3>Move to Trash</h3>
                <p>Are you sure you want to move this note to trash?</p>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="delete-confirm-btn" 
                    onClick={() => handleDeleteNote(confirmDelete)}
                  >
                    Move to Trash
                  </button>
                </div>
              </div>
            </div>
          )}

          {confirmDeletePermanent && (
            <div className="modal-overlay">
              <div className="delete-modal">
                <h3>{confirmDeletePermanent === 'all' ? 'Empty Trash' : 'Delete Permanently'}</h3>
                <p>
                  {confirmDeletePermanent === 'all' 
                    ? 'Are you sure you want to permanently delete all notes in the trash? This action cannot be undone.'
                    : 'Are you sure you want to permanently delete this note? This action cannot be undone.'}
                </p>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setConfirmDeletePermanent(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="delete-confirm-btn" 
                    onClick={() => confirmDeletePermanent === 'all' 
                      ? handleEmptyTrash() 
                      : handleDeletePermanent(confirmDeletePermanent)}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
