import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupCompleted} : {setIsSetupCompleted : (value:boolean)=>void}) => {
    const [isMicCamToggle , setIsMicCamToggle] = useState(false);

    console.log("is Mic and camera toggle" , isMicCamToggle);
    
    const call = useCall();

    if(!call) throw new Error("UseCall must be within Stream Compoenent")
        


    useEffect(()=>{
        if(isMicCamToggle){
            call?.camera.disable();
            call?.microphone.disable();

        }else{
            call?.camera.enable();
            call?.microphone.enable();

        }
    } , [isMicCamToggle , call?.camera , call?.microphone]    )
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
        <h1 className='text-2xl font-bold '>Setup</h1>
        {/* A black screen  */}
        <VideoPreview />
        <div className='flex flex-col h-16 items-center justify-center gap-2 font-medium' >
            <label className='flex items-center justify-center gap-2 mt-20 font-medium '>
                <input type="checkbox"
                checked={isMicCamToggle}
                onChange={(e)=>setIsMicCamToggle(e.target.checked)}
                 />
                 Join with Mic and Camera Off
            </label>
            <DeviceSettings />
            <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={()=>{
                call.join();
                setIsSetupCompleted(true);

            }}>Join Meeting</Button>
        </div>
    </div>
  )
}

export default MeetingSetup