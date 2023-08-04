import React from "react";

export default function Audio({ path }) {
  return (
    <div>
      Audio
      <audio src={`/audios/${path}`} autoPlay={true} />
    </div>
  );
}
