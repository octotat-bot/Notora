import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
const NotesContext = createContext();
export const useNotes = () => useContext(NotesContext);
export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [lockedNotes, setLockedNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [pin, setPin] = useState('');
  const [isPinSet, setIsPinSet] = useState(false);
  const getStorageKey = (key) => {
    return `notora-${key}`;
  };
  useEffect(() => {
    const loadedNotes = localStorage.getItem(getStorageKey('notes'));
    const loadedArchivedNotes = localStorage.getItem(getStorageKey('archived'));
    const loadedTrashedNotes = localStorage.getItem(getStorageKey('trashed'));
    const loadedLockedNotes = localStorage.getItem(getStorageKey('locked'));
    const loadedTags = localStorage.getItem(getStorageKey('tags'));
    const loadedNotebooks = localStorage.getItem(getStorageKey('notebooks'));
    const loadedPin = localStorage.getItem(getStorageKey('pin'));
    if (loadedNotes) setNotes(JSON.parse(loadedNotes));
    if (loadedArchivedNotes) setArchivedNotes(JSON.parse(loadedArchivedNotes));
    if (loadedTrashedNotes) setTrashedNotes(JSON.parse(loadedTrashedNotes));
    if (loadedLockedNotes) setLockedNotes(JSON.parse(loadedLockedNotes));
    if (loadedTags) setTags(JSON.parse(loadedTags));
    if (loadedNotebooks) setNotebooks(JSON.parse(loadedNotebooks));
    if (loadedPin) {
      setPin(loadedPin);
      setIsPinSet(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(getStorageKey('notes'), JSON.stringify(notes));
    localStorage.setItem(getStorageKey('archived'), JSON.stringify(archivedNotes));
    localStorage.setItem(getStorageKey('trashed'), JSON.stringify(trashedNotes));
    localStorage.setItem(getStorageKey('locked'), JSON.stringify(lockedNotes));
    localStorage.setItem(getStorageKey('tags'), JSON.stringify(tags));
    localStorage.setItem(getStorageKey('notebooks'), JSON.stringify(notebooks));
    if (pin) localStorage.setItem(getStorageKey('pin'), pin);
  }, [notes, archivedNotes, trashedNotes, lockedNotes, tags, notebooks, pin]);
  const createNote = (noteData) => {
    const newNote = {
      id: uuidv4(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notebookId: noteData.notebookId || null,
      tagIds: noteData.tagIds || [],
      isPinned: noteData.isPinned || false,
    };
    setNotes([newNote, ...notes]);
    return newNote;
  };
  const updateNote = (id, updates) => {
    let noteIndex = notes.findIndex(note => note.id === id);
    let notesList = notes;
    let setNotesList = setNotes;
    if (noteIndex === -1) {
      noteIndex = archivedNotes.findIndex(note => note.id === id);
      notesList = archivedNotes;
      setNotesList = setArchivedNotes;
    }
    if (noteIndex === -1) {
      noteIndex = lockedNotes.findIndex(note => note.id === id);
      notesList = lockedNotes;
      setNotesList = setLockedNotes;
    }
    if (noteIndex !== -1) {
      const updatedContent = updates.content !== undefined ? updates.content : notesList[noteIndex].content;
      const updatedNote = {
        ...notesList[noteIndex],
        ...updates,
        content: updatedContent, 
        updatedAt: new Date().toISOString()
      };
      const updatedNotes = [...notesList];
      updatedNotes[noteIndex] = updatedNote;
      setNotesList(updatedNotes);
      return updatedNote;
    }
    return null;
  };
  const deleteNote = (id) => {
    let noteIndex = notes.findIndex(note => note.id === id);
    let notesList = notes;
    let setNotesList = setNotes;
    if (noteIndex === -1) {
      noteIndex = archivedNotes.findIndex(note => note.id === id);
      notesList = archivedNotes;
      setNotesList = setArchivedNotes;
    }
    if (noteIndex === -1) {
      noteIndex = lockedNotes.findIndex(note => note.id === id);
      notesList = lockedNotes;
      setNotesList = setLockedNotes;
    }
    if (noteIndex !== -1) {
      const noteToTrash = notesList[noteIndex];
      setTrashedNotes([noteToTrash, ...trashedNotes]);
      const updatedNotes = notesList.filter(note => note.id !== id);
      setNotesList(updatedNotes);
      return true;
    }
    return false;
  };
  const permanentlyDeleteNote = (id) => {
    const updatedTrashedNotes = trashedNotes.filter(note => note.id !== id);
    setTrashedNotes(updatedTrashedNotes);
    return true;
  };
  const restoreNote = (id) => {
    const noteIndex = trashedNotes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const noteToRestore = trashedNotes[noteIndex];
      setNotes([noteToRestore, ...notes]);
      const updatedTrashedNotes = trashedNotes.filter(note => note.id !== id);
      setTrashedNotes(updatedTrashedNotes);
      return true;
    }
    return false;
  };
  const archiveNote = (id) => {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const noteToArchive = notes[noteIndex];
      setArchivedNotes([noteToArchive, ...archivedNotes]);
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      return true;
    }
    return false;
  };
  const unarchiveNote = (id) => {
    const noteIndex = archivedNotes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const noteToUnarchive = archivedNotes[noteIndex];
      setNotes([noteToUnarchive, ...notes]);
      const updatedArchivedNotes = archivedNotes.filter(note => note.id !== id);
      setArchivedNotes(updatedArchivedNotes);
      return true;
    }
    return false;
  };
  const lockNote = (idOrNote) => {
    if (!isPinSet) return { success: false, message: 'PIN not set' };
    let noteToLock;
    let noteId;
    if (typeof idOrNote === 'string') {
      noteId = idOrNote;
      const noteIndex = notes.findIndex(note => note.id === noteId);
      if (noteIndex !== -1) {
        noteToLock = notes[noteIndex];
      } else {
        return { success: false, message: 'Note not found' };
      }
    } else {
      noteToLock = idOrNote;
      noteId = noteToLock.id;
    }
    setLockedNotes([noteToLock, ...lockedNotes]);
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    return { success: true };
  };
  const unlockNote = (id, enteredPin) => {
    if (enteredPin !== pin) return { success: false, message: 'Incorrect PIN' };
    const noteIndex = lockedNotes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const noteToUnlock = lockedNotes[noteIndex];
      setNotes([noteToUnlock, ...notes]);
      const updatedLockedNotes = lockedNotes.filter(note => note.id !== id);
      setLockedNotes(updatedLockedNotes);
      return { success: true };
    }
    return { success: false, message: 'Note not found' };
  };
  const setNotePin = (newPin) => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      return { success: false, message: 'PIN must be 4 digits' };
    }
    setPin(newPin);
    setIsPinSet(true);
    return { success: true };
  };
  const verifyPin = (enteredPin) => {
    return enteredPin === pin;
  };
  const createTag = (name, color = '#ffd700') => {
    const newTag = {
      id: uuidv4(),
      name,
      color,
      createdAt: new Date().toISOString()
    };
    setTags([...tags, newTag]);
    return newTag;
  };
  const updateTag = (id, updates) => {
    const tagIndex = tags.findIndex(tag => tag.id === id);
    if (tagIndex !== -1) {
      const updatedTag = {
        ...tags[tagIndex],
        ...updates
      };
      const updatedTags = [...tags];
      updatedTags[tagIndex] = updatedTag;
      setTags(updatedTags);
      return updatedTag;
    }
    return null;
  };
  const deleteTag = (id) => {
    const updateNoteTagIds = (noteList) => {
      return noteList.map(note => {
        if (note.tagIds && note.tagIds.includes(id)) {
          return {
            ...note,
            tagIds: note.tagIds.filter(tagId => tagId !== id),
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });
    };
    setNotes(updateNoteTagIds(notes));
    setArchivedNotes(updateNoteTagIds(archivedNotes));
    setLockedNotes(updateNoteTagIds(lockedNotes));
    setTrashedNotes(updateNoteTagIds(trashedNotes));
    const updatedTags = tags.filter(tag => tag.id !== id);
    setTags(updatedTags);
    return true;
  };
  const createNotebook = (name, description = '') => {
    const newNotebook = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString()
    };
    setNotebooks([...notebooks, newNotebook]);
    return newNotebook;
  };
  const updateNotebook = (id, updates) => {
    const notebookIndex = notebooks.findIndex(notebook => notebook.id === id);
    if (notebookIndex !== -1) {
      const updatedNotebook = {
        ...notebooks[notebookIndex],
        ...updates
      };
      const updatedNotebooks = [...notebooks];
      updatedNotebooks[notebookIndex] = updatedNotebook;
      setNotebooks(updatedNotebooks);
      return updatedNotebook;
    }
    return null;
  };
  const deleteNotebook = (id) => {
    const updateNoteNotebookIds = (noteList) => {
      return noteList.map(note => {
        if (note.notebookId === id) {
          return {
            ...note,
            notebookId: null,
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });
    };
    setNotes(updateNoteNotebookIds(notes));
    setArchivedNotes(updateNoteNotebookIds(archivedNotes));
    setLockedNotes(updateNoteNotebookIds(lockedNotes));
    setTrashedNotes(updateNoteNotebookIds(trashedNotes));
    const updatedNotebooks = notebooks.filter(notebook => notebook.id !== id);
    setNotebooks(updatedNotebooks);
    return true;
  };
  const emptyTrash = () => {
    setTrashedNotes([]);
  };
  const getNotesByNotebook = (notebookId) => {
    const filteredNotes = notes.filter(note => note.notebookId === notebookId);
    return filteredNotes;
  };
  const getNotesWithoutNotebook = () => {
    return notes.filter(note => !note.notebookId);
  };
  const getNotesByTag = (tagId) => {
    return notes.filter(note => note.tagIds && note.tagIds.includes(tagId));
  };
  const togglePinNote = (id) => {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const updatedNote = {
        ...notes[noteIndex],
        isPinned: !notes[noteIndex].isPinned,
        updatedAt: new Date().toISOString()
      };
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = updatedNote;
      setNotes(updatedNotes);
      return { success: true, isPinned: updatedNote.isPinned };
    }
    return { success: false, message: 'Note not found' };
  };
  const value = {
    notes,
    archivedNotes,
    trashedNotes,
    lockedNotes,
    createNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    archiveNote,
    unarchiveNote,
    lockNote,
    unlockNote,
    togglePinNote,
    emptyTrash,
    tags,
    createTag,
    updateTag,
    deleteTag,
    getNotesByTag,
    notebooks,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    getNotesByNotebook,
    getNotesWithoutNotebook,
    pin,
    isPinSet,
    setNotePin,
    verifyPin
  };
  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};