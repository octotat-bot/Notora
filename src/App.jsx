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
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
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
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/new" element={<NoteEditorPage />} />
                <Route path="/edit/:id" element={<NoteEditorPage />} />
                <Route path="/trash" element={<TrashPage />} />
                <Route path="/tags" element={<TagsPage />} />
                {/* Protected notebooks route - require authentication */}
                <Route 
                  path="/notebooks" 
                  element={
                    <>
                      <SignedIn>
                        <NotebooksPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Auth routes */}
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                
                {/* Protected routes - require authentication */}
                <Route 
                  path="/archive" 
                  element={
                    <>
                      <SignedIn>
                        <ArchivePage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route 
                  path="/locked" 
                  element={
                    <>
                      <SignedIn>
                        <LockedNotesPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route 
                  path="/locked/:id" 
                  element={
                    <>
                      <SignedIn>
                        <LockedNotesPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                
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
