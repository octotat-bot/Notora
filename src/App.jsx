import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NotificationProvider from './context/NotificationContext';
import { NotesProvider } from './context/NotesContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import NoteEditorPage from './pages/NoteEditorPage';
import ArchivePage from './pages/ArchivePage';
import TrashPage from './pages/TrashPage';
import TagsPage from './pages/TagsPage';
import NotebooksPage from './pages/NotebooksPage';
import LockedNotesPage from './pages/LockedNotesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return (
    <NotificationProvider>
      <NotesProvider>
        <BrowserRouter>
          <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/new" element={<NoteEditorPage />} />
                <Route path="/edit/:id" element={<NoteEditorPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/trash" element={<TrashPage />} />
                <Route path="/tags" element={<TagsPage />} />
                <Route path="/notebooks" element={<NotebooksPage />} />
                <Route path="/locked" element={<LockedNotesPage />} />
                <Route path="/locked/:id" element={<LockedNotesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotesProvider>
    </NotificationProvider>
  );
}
export default App;
