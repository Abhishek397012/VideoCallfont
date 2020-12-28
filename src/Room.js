import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import peer from "peerjs";
import Video from "./Video.js";

let socket;

export default function Room() {
  const [peers, setPeers] = useState([]);
  const myStream = useRef();

  useEffect(() => {
    // connecting with socket server
    socket = io("https://wemeetdemoserver.herokuapp.com/");

    // connecting with peer server
    const myPeer = new peer();

    // getting unique id from peer server and asking backend to join room
    myPeer.on("open", id => {
      console.log("id", id);
      socket.emit("join-room", id);
    });

    // getting video and audio
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(stream => (myStream.current.srcObject = stream))
      .catch(err => console.log(err));

    // server tells us a user has connected with his ID and we call that user
    socket.on("user-connected", id => {
      const call = myPeer.call(id, myStream.current.srcObject);
      setPeers(peers => [...peers, { call: call, id: call.peer }]);
    });

    // when a user recieves a call it answers the call with it's own stream
    myPeer.on("call", call => {
      call.answer(myStream.current.srcObject);
      setPeers(peers => [...peers, { call: call, id: call.peer }]);
    });

    // to remove an user upon disconnect
    socket.on("user-disconnected", idToRemove => {
      setPeers(peers => {
        const newPeers = peers.map(call => {
          if (!call) return null;
          if (call.id !== idToRemove) {
            return call;
          } else {
            return null;
          }
        });
        return newPeers;
      });
    });
  }, []);

  useEffect(() => {
    console.log("peers changed: ", peers);
  }, [peers]);

  return (
    <div className="App">
      <video ref={myStream} muted autoPlay className="video" />
      {peers.map(call => call && <Video call={call.call} key={call.id} />)}
    </div>
  );
}
