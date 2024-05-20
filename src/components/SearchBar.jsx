import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
const SearchBar = ({ searchQuery, setSearchQuery, onClear }) => {
  const handleClear = () => {
    setSearchQuery('');
    if (onClear) onClear();
  };
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="clear-search" onClick={handleClear}>
          <FiX />
        </button>
      )}
    </div>
  );
};
export default SearchBar;