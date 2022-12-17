import React, { useRef, useState, useEffect } from "react";
import Header from "../../components/Header";
import Movie from "../../components/Movie";
import Message from "../../plugins/message";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getBaseUrl } from "../../util/util";

function Home() {
  let urlBackend = getBaseUrl();

  const message = useRef();
  const [movies, setMovies] = useState([]);
  const [actualPage, setActualPage] = useState(1);
  const [searchMovie, setSearchMovie] = useState();
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    console.log("useEffect", actualPage);
    searchMovies(searchMovie, false);
  }, [actualPage]);

  const searchMovies = (e, inputText = true) => {
    if (e?.target?.value === "" || e?.target?.value === undefined) {
      setMovies([]);
      return;
    }

    if (inputText) setActualPage(1);

    setSearchMovie(e);

    const params = {
      idUsuario: 1, //fingerPrint(),
      search: e.target.value,
      page: actualPage,
    };

    const options = {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(params),
    };

    fetch(urlBackend + "search-movie", options)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        setMovies([]);
        let movies = [];

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        if (data.Search?.length >= 0) {
          for (var i = 0; i < data.Search?.length; i++) {
            movies.push(data.Search[i]);
          }
        }

        if (data?.totalResults) setTotalResults(data?.totalResults);
        else setTotalResults(0);

        setMovies(movies);
      })
      .catch((error) => {
        message.current.Error(error);
      });
  };

  const nextPage = () => {
    console.log("actualPage A", actualPage);
    if (actualPage <= totalResults) {
      let page = actualPage + 1;
      setActualPage(page);
    }
    console.log("actualPage D", actualPage);

    console.log(
      " nextPage actualPage",
      actualPage,
      "totalRe",
      totalResults,
      "searchMovie",
      searchMovie
    );
  };

  const returnPage = () => {
    console.log("returnPage");
    if (actualPage > 1) {
      let page = actualPage - 1;
      setActualPage(page);
    }
    console.log(
      " returnPage actualPage",
      actualPage,
      "totalRe",
      totalResults,
      "searchMovie",
      searchMovie
    );
  };

  return (
    <div>
      <Header />
      <Message ref={message} />
      <div className="container-content">
        <div className="p-d-md-flex p-jc-sm-between">
          <h2>Search</h2>
          <span className="p-col-12 p-md-3 p-pt-sm-3 p-pt-md-0 p-input-icon-left">
            <i className="p-pt-sm-2 p-pt-md-0 pi pi-search" />
            <InputText
              onChange={searchMovies}
              className="p-col-12"
              placeholder="Search"
            />
          </span>
        </div>

        <div
          className={`p-mt-5 p-grid ${
            movies.length <= 0 ? "p-jc-center" : "p-jc-sm-center p-jc-md-start"
          }`}
        >
          {movies.length <= 0 ? (
            <div className="p-pt-6 p-text-center">
              <i className="pi pi-search" style={{ fontSize: "13em" }} />
              <p
                className="p-text-center p-m-auto"
                style={{ maxWidth: "228px" }}
              >
                We couldn´t find the movies you were lookin for :(
              </p>
            </div>
          ) : (
            movies.map((movie) => {
              return (
                <div
                  key={movie.imdbID}
                  className="p-m-2"
                  style={{
                    maxHeight: "600px",
                    maxWidth: "268px",
                    overflow: "hidden",
                  }}
                >
                  <Movie data={movie} page="search" />
                </div>
              );
            })
          )}
        </div>
        {movies.length > 0 && totalResults > 10 ? (
           <div className="p-d-flex p-jc-evenly p-jc-md-between p-ai-center">
           <Button
             label="Prev"
             onClick={returnPage}
           />
           <h3>{actualPage}</h3>
           <Button
             label="Next"
             onClick={nextPage}
           />
         </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Home;
