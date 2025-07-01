import React, { useEffect, useRef } from "react";
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

export default function DecentralizedVideoPlayer({ cid }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let helia, fs, mediaSource, sourceBuffer;
    let url;
    async function streamVideo() {
      helia = await createHelia();
      fs = unixfs(helia);
      mediaSource = new window.MediaSource();
      url = URL.createObjectURL(mediaSource);
      videoRef.current.src = url;

      mediaSource.addEventListener("sourceopen", async () => {
        sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        for await (const chunk of fs.cat(cid)) {
          await new Promise((resolve) => {
            sourceBuffer.appendBuffer(chunk);
            sourceBuffer.addEventListener("updateend", resolve, { once: true });
          });
        }
        mediaSource.endOfStream();
      });
    }
    if (cid) streamVideo();
    return () => {
      if (url) URL.revokeObjectURL(url);
      if (helia) helia.stop();
    };
  }, [cid]);

  return <video ref={videoRef} controls style={{ width: "100%" }} />;
}
