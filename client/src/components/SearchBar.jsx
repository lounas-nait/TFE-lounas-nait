import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchHandler = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search flex justify-between items-center px-5 py-2 bg-gray-100 rounded">
      <input
        type="text"
        placeholder="Search product"
        className="bg-transparent outline-0"
        value={searchQuery}
        onChange={searchHandler}
      />
      <button onClick={searchHandler}>
        <CiSearch />
      </button>
    </div>
  );
};

export default SearchBar;
