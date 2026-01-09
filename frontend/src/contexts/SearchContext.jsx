// =============================================================================
// 🔵 PABLO - UI Architect
// SearchContext.jsx - Shared state for search modal
// =============================================================================
//
// TODO: Create a context that manages the search modal visibility
//
// This is a simple context that provides:
// - isSearchModalOpen: Boolean state
// - openSearch(): Set modal open
// - closeSearch(): Set modal closed
// - toggleSearch(): Toggle open/closed
//
// Used by:
// - TopBar (search button opens modal)
// - SearchModal (consumes this context)
//
// Think about:
// - This context could be expanded later with search history, filters, etc.
// - For now, just manages modal visibility
//
// Hint: const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
// =============================================================================

import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSearch = () => {
    // TODO: Set isSearchModalOpen to true
  };
  
  const closeSearch = () => {
    // TODO: Set isSearchModalOpen to false
  };
  
  const toggleSearch = () => {
    // TODO: Toggle isSearchModalOpen
  };

  return (
    <SearchContext.Provider value={{ 
      isSearchModalOpen,
      openSearch,
      closeSearch,
      toggleSearch,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

export default SearchContext;
