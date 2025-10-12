import React from "react";

const MovieCard = ({
  title,
  vote_average,
  poster_path,
  release_date,
  original_language,
}) => {
  return (
    <div className="">
      <div className="w-48 md:w-56 lg:w-64 flex flex-col">
        <img
          className="w-full h-auto"
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : `no-movie.png`
          }
          alt={title}
        />
        <div className="text-sm md:text-md lg:text-lg">{title}</div>
        <div className="flex flex-col sm:flex-row sm:gap-4  gap-1 mb-4 text-sm md:text-md lg:text-lg">
          <div className="flex">
            <img src="star.svg" alt="" />
            {vote_average.toFixed(2)}
          </div>
          <div className="text-green-500">{release_date}</div>
          <div className="bg-red-500">{original_language.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
