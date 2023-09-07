import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [filmsList, setFilmsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-8431e-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      console.log(responseData);

      let data = [];

      for (const key in responseData) {
        data.push({
          id: key,
          openingText: responseData[key].openingText,
          title: responseData[key].title,
          releaseDate: responseData[key].releaseDate,
        });
      }

      setFilmsList(data);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-8431e-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        Headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log(data);
  }

  let content = <h1>No movies found!</h1>;

  if (filmsList.length > 0) content = <MoviesList movies={filmsList} />;
  if (error) content = <h1>{error}</h1>;
  if (isLoading) content = <h1>Loading ...</h1>;

  return (
    <React.Fragment>
      <section>
        <section>
          <AddMovie onAddMovie={addMovieHandler} />
        </section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
