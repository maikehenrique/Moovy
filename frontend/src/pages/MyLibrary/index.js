import "../../styles/mylibrary.css";
import Header from "../../components/Header";
import Movie from "../../components/Movie";
import React, {useRef, useState, useEffect } from "react";
import Message from "../../plugins/message";
import { getBaseUrl } from "../../util/util";

function MyLibrary() {
  let urlBackend = getBaseUrl()

  const message = useRef();
  const [searchValue, setSearchValue] = useState([]);
  
  useEffect(() => {
    getDataFromAPI();
  }, []);

  const getDataFromAPI = () => {
    const params = {
      idUser: 1,//fingerPrint(),
    };

    const options = {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(params),
    };

    fetch(urlBackend+"favorit-movie-all", options)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        setSearchValue([]);
        let movies = [];

        if (data.Search?.length >= 0) {
          for (var i = 0; i < data.Search?.length; i++) {
            movies.push(data.Search[i]);
          }
        }
        setSearchValue(movies);
      })
      .catch((error) => {
        message.current.Error(error);
      });
  };

  return (
    <div>
      <Header />
      <Message ref={message} />
      <div className="container-content">
        <h2>MyLibrary</h2>
        <div
          className={(`p-mt-5 p-grid p-jc-sm-center  ${
            searchValue.length <= 0 ? "p-jc-center" : "p-jc-md-start"
          }`)}
        >
          {searchValue.length <= 0 ? (
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
            searchValue.map((movie) => {
              return (
                <div
                  key={movie.imdbID}
                  className="p-m-2"
                  style={{
                    maxHeight: "600px",
                    maxWidth: "268px",
                    overflow: "hidden",
                    display: "inline-block",
                  }}
                >
                  <Movie data={movie} page="mylibrary" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLibrary;
