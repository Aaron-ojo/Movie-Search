import React from "react";

const Search = (props) => {
  const { searchTerm, setSearchTerm } = props;
  return (
    <div className="text-white text-3xl flex gap-4 border-white border-4 max-w-2xl rounded-lg mx-auto w-full">
      <img
        src="search.svg"
        alt="search"
        className="w-6 h-6 sm:w-8 sm:h-8 self-center "
      />
      <input
        type="text"
        className="w-full text-base sm:text-lg md:text-xl p-2 outline-none placeholder: text-base sm:placeholder:text-lg md:placeholder:text-xl"
        placeholder="search through thousands of movies "
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
    </div>
  );
};

export default Search;
