"use client"
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

const Meeting = ({params} : {params : {id:string}}) => {
  const {user , isLoaded} = useUser();
  const [isSetupCompleted , setIsSetupCompleted] = useState(false);
  const {call  , isCallLoading} = useGetCallById(params.id)

  if(!isLoaded || isCallLoading) return <Loader />

  console.log("Setup video completed toggle" , isSetupCompleted);
  

  //  this streamCall contains the call details and is and we can use this call in MeetingSetup.tsx to render call

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupCompleted?(
            <MeetingRoom />
          ):(
            <MeetingSetup setIsSetupCompleted={setIsSetupCompleted} />
          )}
        </StreamTheme>
      </StreamCall>

    </main>
  )
}

export default Meeting