import React from "react";
import Artist from "./Artist";

function Artists({ artists , setArtistName }) {
  return (
    <>
      <section className="display-cards">
          {artists.map((artist) => {
             return  <Artist key={artist.id} artist={artist} setArtistName={setArtistName} />
          })}
      </section>
    </>
  );
}

export default Artists;
