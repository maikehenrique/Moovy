import "../../styles/movie.css";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import Message from "../../plugins/message";
import { b64toBlob, blobToBase64, isMobile, getBaseUrl } from "../../util/util";
import MicRecorder from "mic-recorder-to-mp3";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function Movie(props) {
  const message = useRef();
  let urlBackend = getBaseUrl();
  console.log("getBaseUrl()", getBaseUrl());

  const [movieObject, setMovieObject] = useState(props.data);
  const [actualPage] = useState(props.page);
  const [playingReview, setPlayingReview] = useState(false);
  const [stateRecorder, setStateRecorder] = useState({
    isRecording: false,
    blobURL: "",
    isBlocked: false,
  });

  const [visibleDialogDeleteAudio, setVisibleDialogDeleteAudio] =
    useState(false);
  const [visibleDialogDeleteFavoritMovie, setVisibleDialogDeleteFavoritMovie] =
    useState(false);

  useEffect(() => {
    if (movieObject?.review !== null && movieObject?.review !== undefined) {
      let blob = b64toBlob(movieObject.review[0].review);
      const blobURL = URL.createObjectURL(blob);
      setStateRecorder((prev) => ({ ...prev, blobURL, isRecording: false }));
    }

    function searchMovieComplete() {
      //Search all movie information
      const params = {
        imdbRating: movieObject.imdbID,
      };

      const options = {
        method: "POST",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify(params),
      };

      fetch(urlBackend + "find-movie-complete", options)
        .then(async (response) => {
          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson ? await response.json() : null;

          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          setMovieObject((prev) => ({
            ...prev,
            imdbRating: data.imdbRating,
            Title: data.Title,
            Poster: data.Poster,
          }));
        })
        .catch((error) => {
          message.current.Error(error);
        });
    }
    searchMovieComplete();

    var audio = document.getElementById("player" + movieObject.imdbID);
    audio.addEventListener("ended", EventFinishAudioReview);
  }, []);

  const actionMovie = (id, action) => {
    //Movie action to add/remove from favorites
    const params = {
      idUser: 1, //fingerPrint(),
      idMovie: id,
      action: action,
    };

    const options = {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(params),
    };

    fetch(
      urlBackend + "favorit-movie" + (action === "R" ? "/remove" : "/add"),
      options
    )
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        setMovieObject((prev) => ({
          ...prev,
          favorit: action === "R" ? false : true,
        }));

        message.current.Success(
          action === "R"
            ? "'" + movieObject.Title + "' removed to your Library"
            : "'" + movieObject.Title + "' added to your Library"
        );

        if (action === "R") removeAudioComponent();
      })
      .catch((error) => {
        message.current.Error(error);
      });
  };

  const saveReview = (action = "A", review) => {
    const params = {
      idUser: 1, //fingerPrint(),
      idMovie: movieObject.imdbID,
      action: action,
      review: review,
    };

    const options = {
      method: "POST",
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(params),
    };

    fetch(urlBackend + "review-movie", options)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        message.current.Error(error);
      });
  };

  const removeReview = () => {
    const options = {
      method: "DELETE",
      headers: { "Content-type": "application/json;charset=UTF-8" },
    };

    fetch(urlBackend + "review-movie/" + movieObject.imdbID, options)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        removeAudioComponent();
      })
      .catch((error) => {
        message.current.Error(error);
      });
  };

  const removeAudioComponent = () => {
    setStateRecorder((prev) => ({
      ...prev,
      blobURL: null,
      isRecording: false,
    }));
  };

  const startRecorder = () => {
    navigator.mediaDevices.getUserMedia(
      //Request permission record audio
      { audio: true },
      () => {
        message.current.Error("Permission Granted");
        setStateRecorder((prev) => ({ ...prev, isBlocked: false }));
      },
      () => {
        message.current.Error("Permission denied to record audio");
        setStateRecorder((prev) => ({ ...prev, isBlocked: true }));
      }
    );
    if (stateRecorder.isBlocked) {
      message.current.Error("Permission denied to record audio");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setStateRecorder((prev) => ({ ...prev, isRecording: true }));
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecorder = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);

        setStateRecorder((prev) => ({ ...prev, blobURL, isRecording: false }));

        let file = await blobToBase64(blob);

        await saveReview("A", file);
      })
      .catch((e) => console.log(e));
  };

  function ButtonStopRecorder(props) {
    return (
      <Button
        icon="pi pi-stop"
        className="button-play-stop p-button-rounded p-button-success"
        aria-label="Stop"
        onClick={stopRecorder}
      />
    );
  }

  function ButtonStartRecorder(props) {
    return (
      <Button
        icon="mdi mdi-microphone"
        className="button-play-stop button-play-record p-button-rounded p-button-secondary"
        aria-label="Record"
        onClick={startRecorder}
      />
    );
  }

  function RecordButtons(props) {
    if (actualPage === "mylibrary") {
      if (stateRecorder.isRecording) return ButtonStopRecorder();
      else return ButtonStartRecorder();
    }
  }

  function ButtonPlayReview(props) {
    return (
      <Button
        icon="pi pi-play"
        className={"p-button-rounded p-button-secondary content-center-web"}
        aria-label="Record"
        onClick={PlayAudioReviewControl}
      />
    );
  }

  function ButtonPauseReview(props) {
    return (
      <Button
        icon="pi pi-stop"
        className={"p-button-rounded p-button-danger content-center-web"}
        aria-label="Stop"
        onClick={PauseAudioReviewControl}
      />
    );
  }

  function PlayPauseButtons(props) {
    if (stateRecorder?.blobURL) {
      if (playingReview) return ButtonPauseReview();
      else return ButtonPlayReview();
    } else if (
      !stateRecorder?.blobURL &&
      !isMobile() &&
      actualPage === "mylibrary"
    ) {
      return (
        <div className="content-center message-record-review">
          <h2 className="p-text-center">Record a Review on Mobile App!</h2>
        </div>
      );
    } else if (
      !stateRecorder?.blobURL &&
      isMobile() &&
      actualPage === "mylibrary"
    ) {
      return RecordButtons();
    }
  }

  function PlayAudioReviewControl() {
    document.getElementById("player" + movieObject.imdbID)?.play();
    setPlayingReview(true);
  }

  function PauseAudioReviewControl() {
    document.getElementById("player" + movieObject.imdbID)?.pause();
    setPlayingReview(false);
  }

  function EventFinishAudioReview() {
    setPlayingReview(false);
  }

  const acceptDialogConfirmDeleteFavorit = () => {
    actionMovie(movieObject.imdbID, movieObject.favorit ? "R" : "A");
  };

  return (
    <div
      className={"movie-class p-p-2"}
      style={{ maxWidth: "100%", height: "100%" }}
    >
      <Message ref={message} />

      <audio
        style={{ display: "none" }}
        id={"player" + movieObject.imdbID}
        src={stateRecorder.blobURL}
        controls="controls"
      />
      <div>
        <div className="container-image">
          {movieObject.Poster !== "N/A" ? (
            <img
              src={movieObject.Poster}
              width="250"
              alt={movieObject.Title}
              height="330"
              className="image"
            />
          ) : (
            <div className="image img-movie-blank"></div>
          )}

          <div className="overlay">
            {isMobile() && stateRecorder?.blobURL ? (
              <Button
                icon="mdi mdi-24px mdi-trash-can-outline"
                className={"p-button-rounded p-button-danger"}
                aria-label="Delete"
                onClick={() => setVisibleDialogDeleteAudio(true)}
              />
            ) : (
              <div></div>
            )}

            <PlayPauseButtons />
          </div>
        </div>
      </div>
      <div
        className={
          "p-col-12 p-ai-center" +
          (isMobile()
            ? " p-jc-center p-text-center p-mb-0"
            : " p-d-flex p-jc-between")
        }
        style={!isMobile() ? { minHeight: "70px" } : null}
      >
        <div className={"p-d-flex" + (isMobile() ? "p-col-12" : "p-col-9")}>
          <p className={isMobile() ? "p-mb-0" : ""}>{movieObject.Title}</p>
        </div>
        <div
          className={
            "p-d-flex p-ai-center" +
            (isMobile() ? " p-jc-center p-m-0" : " p-col-3 ")
          }
        >
          <i className="star mdi mdi-24px mdi-star"></i>
          <p className="p-m-0">{movieObject.imdbRating}</p>
        </div>
      </div>
      <div>
        <ConfirmDialog
          visible={visibleDialogDeleteAudio}
          onHide={() => setVisibleDialogDeleteAudio(false)}
          message={`Are you sure you want to delete ”${movieObject.Title}” review?`}
          header="Delete audio"
          icon="pi pi-exclamation-triangle"
          accept={removeReview}
        />
        <ConfirmDialog
          visible={visibleDialogDeleteFavoritMovie}
          onHide={() => setVisibleDialogDeleteFavoritMovie(false)}
          message={`Are you sure you want to remove ”${movieObject.Title}” from your library?  It contains a audio review and you will lose it if your remove.`}
          header="Delete Review"
          icon="pi pi-exclamation-triangle"
          accept={acceptDialogConfirmDeleteFavorit}
        />
      </div>

      <Button
        style={isMobile() ? { display: "none" } : {}}
        className={
          !movieObject.favorit ? "p-col-12" : "p-button-danger p-col-12"
        }
        onClick={() => {
          if (!stateRecorder?.blobURL)
            actionMovie(movieObject.imdbID, movieObject.favorit ? "R" : "A");
          else setVisibleDialogDeleteFavoritMovie(true);
        }}
      >
        <i className="pi pi-book px-2"></i>
        <span className="p-ml-3">
          {!movieObject.favorit ? "Add to my library" : "Remove"}
        </span>
      </Button>
    </div>
  );
}

export default Movie;
