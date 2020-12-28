import React, { useEffect, useRef } from "react";
import "./App.css";

export default function Video({ call }) {
  const ref = useRef();

  useEffect(() => {
    call.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video ref={ref} autoPlay className="video" muted />;
}
