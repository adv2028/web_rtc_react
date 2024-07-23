import { useEffect, useRef, useState } from "react"
import Peer from "peerjs"
import './App.css'

function App() {
  const [peerId, setPeerId] = useState(null)
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("")
  const peerInstance = useRef(null)

  const remoteVideoRef = useRef()
  const currentVideoRef = useRef()

  useEffect(() => {
    const peer = new Peer({
      host: '/',
      port: '3001'
    });

    peer.on("open", (id) => {
      console.log("My peer id: ", id);
      setPeerId(id)
    })

    peer.on("call", (call) => {
      const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: false }, (mediastream) => {
        currentVideoRef.current.srcObject = mediastream
        currentVideoRef.current.play()

        call.answer(mediastream);
        call.on('stream', function (remoteStream) {
          // Show stream in some video/canvas element.
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play()
        });

      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    })

    peerInstance.current = peer
  }, [])

  const call = (remotePeerId) => {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: false }, (mediastream) => {
      currentVideoRef.current.srcObject = mediastream
      currentVideoRef.current.play()

      // Create a new call
      const call = peerInstance.current.call(remotePeerId, mediastream);

      call.on('stream', function (remoteStream) {

        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play()
      });
    }, function (err) {
      console.log('Failed to get local stream', err);
    });
  }

  return (
    <>
      <h3>user id / peer id: {peerId}</h3>
      <input type="text" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>

      <video ref={currentVideoRef} audio={false}></video>
      <video ref={remoteVideoRef} audio={false}></video>
    </>
  )
}

export default App
