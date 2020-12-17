import React , {useState , useRef , useEffect}  from 'react'
import './App.css';
import io from 'socket.io-client'
import peer from 'peerjs'
import Video from './Video.js'

let socket 

export default function Room() {

    const [peers,setPeers] = useState([])
    const myStream = useRef()

    useEffect( () => {

        socket = io('http://localhost:8000')

        const myPeer = new peer()

        myPeer.on('open' , id => {
            console.log('id', id)
            socket.emit('join-room' , id)
        })
        
        navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        }).then(stream => {
            myStream.current.srcObject = stream
        }).catch(err => console.log(err))

        socket.on('user-connected' , id=>{
            const call = myPeer.call(id,myStream.current.srcObject)
            setPeers(peers=>[...peers,call])
            call.on('close',()=>{
                // removing logic
            })
        })

        myPeer.on('call' , call => {
            call.answer(myStream.current.srcObject)
            setPeers(peers=>[...peers,call])
            call.on('close',()=>{
                // removing logic
            })
        })


    } , [])

    return (
      
        <div className="App">
            <video ref={myStream} muted autoPlay width='40%'/>
            {peers.map((call,index) => <Video call={call} key = {index}/>)}
        </div>
    )
}
