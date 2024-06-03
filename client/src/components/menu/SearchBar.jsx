import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchHandler = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center bg-gray-100 rounded w-full max-w-md">
      <input
        type="text"
        placeholder="Search product"
        className="bg-transparent outline-none pl-4 pr-10 py-2 w-full"
        value={searchQuery}
        onChange={searchHandler}
      />
      <button onClick={searchHandler} className="absolute right-2">
        <CiSearch className="text-gray-600" />
      </button>
    </div>
  );
};

export default SearchBar;
