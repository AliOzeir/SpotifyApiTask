import React from "react";
import { useState, useEffect } from "react";
import useAuth from "../useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import Form from "./Form";
import Artists from "./Artists";
import Albums from "./Albums";

const spotifyApi = new SpotifyWebApi({
  clientId: "acd05d13f54a492bb113f5bcd2784874",
});

export default function Dashboard({ code }) {
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [albums, setAlbums] = useState([]);
  const accessToken = useAuth(code);

  // Whenever we get the token, set it in spotifyApi
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //If the token is valid and the search bar is not empty, get the results immediatly
  useEffect(() => {
    if (!search) return setArtists([]);
    if (!accessToken) return;

    spotifyApi.searchArtists(search).then((res) => {
      // console.log(res.body);
      setArtists(res.body.artists.items);
    });
  }, [search, accessToken]);

  // Fetching albums for the selected Artist
  useEffect(() => {
    if (!artistName) return;
    if (!accessToken) return;
    spotifyApi.searchAlbums(artistName).then((res) => {
      const dataAlbums = res.body.albums.items;
      const neededDataAlbums = [];

      for (var i = 0; i < dataAlbums.length; i++) {
        // Iterating in the albums
        const dataArtists = dataAlbums[i].artists;
        for (var j = 0; j < dataArtists.length; j++) {
          //Iterating in the artists array
          const dataArtistName = dataArtists[j].name;
          if (dataArtistName === artistName) {
            // Checking if the artistName is the same as the selectedArtistName
            neededDataAlbums.push(dataAlbums[i]);
            break;
          }
        }
      }
      window.history.pushState({}, null, `/${artistName}/albums`);
      setAlbums(neededDataAlbums);
    });
  }, [artistName]);

  useEffect(() => {
    if (!artistName) return;
    window.addEventListener("popstate", () => {
      window.history.pushState({}, null, "/search");
      setArtistName("");
    });
    return () => {
      window.removeEventListener("popstate", () => {
        window.history.pushState({}, null, "/search");
        setArtistName("");
      });
    };
  });

  return (
    <section
      className={`d-flex align-items-center flex-column py-2 ${
        search || "main"
      }`}
      style={{ height: "80vh" , width: "90%" , margin:"auto"}}
    >
      {!artistName && <Form search={search} setSearch={setSearch} />}
      {!artistName && search && (
        <Artists artists={artists} setArtistName={setArtistName} />
      )}
      {artistName && <Albums albums={albums} artistName={artistName} />}
    </section>
  );
}
