import React, { useEffect, useRef } from "react";

export default function DecentralizedVideoPlayer({ arweaveTxId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (arweaveTxId) {
      const videoUrl = `https://arweave.net/${arweaveTxId}`;
      videoRef.current.src = videoUrl;
      videoRef.current.load(); // Load the video
    }
  }, [arweaveTxId]);

  return <video ref={videoRef} controls style={{ width: "100%" }} />;
}
