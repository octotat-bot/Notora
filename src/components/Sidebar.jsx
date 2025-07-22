import { Link, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import {
  FiHome,
  FiArchive,
  FiTag,
  FiBook,
  FiTrash2,
  FiLock,
  FiPlus,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';
const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { notes, archivedNotes, trashedNotes, lockedNotes, tags, notebooks } = useNotes();
  const navItems = [
    {
      path: '/',
      name: 'Home',
      icon: <FiHome />,
      count: notes.length
    },
    {
      path: '/archive',
      name: 'Archive',
      icon: <FiArchive />,
      count: archivedNotes.length
    },
    {
      path: '/tags',
      name: 'Tags',
      icon: <FiTag />,
      count: tags.length
    },
    {
      path: '/notebooks',
      name: 'Notebooks',
      icon: <FiBook />,
      count: notebooks.length,
      protected: true
    },
    {
      path: '/trash',
      name: 'Trash',
      icon: <FiTrash2 />,
      count: trashedNotes.length
    },
    {
      path: '/locked',
      name: 'Locked Notes',
      icon: <FiLock />,
      count: lockedNotes.length,
      protected: true
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <FiUser />,
      count: null
    }
  ];
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📝</span>
          <span className="sidebar-logo-text">Notora</span>
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiMenu /> : <FiX />}
        </button>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const isProtected = item.protected && !isSignedIn;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${isProtected ? 'protected' : ''}`}
              title={isProtected ? `Sign in to access ${item.name}` : ''}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {!collapsed && (
                <span className="nav-item-text">
                  {item.name}
                  {isProtected && <span className="lock-indicator">🔒</span>}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="sidebar-actions">
        <Link to="/new" className="new-note-btn">
          <FiPlus />
          {!collapsed && <span>New Note</span>}
        </Link>
        
        {!collapsed && (
          <div className="sidebar-auth">
            {isSignedIn ? (
              <div className="user-info">
                <UserButton afterSignOutUrl="/" />
                <span className="user-name">{user?.firstName || 'User'}</span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="sign-in-btn">
                  <FiUser /> Sign In
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;