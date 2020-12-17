import React,{useEffect,useRef} from 'react'

export default function Video({call}) {
    
    const ref = useRef()

    useEffect(() => {
        
        call.on('stream' , stream => {
            ref.current.srcObject = stream
        })
        
    }, [])


    return <video ref = {ref} autoPlay width='70%'/>
}
