import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchOption, setSearchOption] = useState('product');

  const updateSearchValue = (value) => {
    setSearchValue(value);
  };

  const updateSearchOption = (option) => {
    setSearchOption(option);
  };

  

  return (
    <SearchContext.Provider value={{ searchValue, updateSearchValue, searchOption, updateSearchOption }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

