"use client"
import React, { useState } from 'react'
import { useToast } from './ui/use-toast'

import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

const MeetingTypeRoom = () => {
  const { toast } = useToast()
    const router = useRouter();
    const [meetingState , setMeetingState] = useState<"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined>()
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values , setValues] = useState({
      dateTime:new Date(Date.now()),
      description:"",
      link:""
    })
    const [callDetails , setCallDetails] = useState<Call>()

    const createMeeting = async ()=>{
      if(!user || !client)return;
      //  Date and time foe scheduling a meeting 
      try {
        if(!values.dateTime){
          toast({
            title: "Please select a date and time"
            
          })
          return;

        }
        const id = crypto.randomUUID();
        const call = client.call("default" , id);
        console.log("Call Before Created" , call);
        
        if(!call) throw new Error("Failed to create call")
          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || "Instant Meeting"
        // create a call object with date , time and description
        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description
            }
          }

        })
        console.log("Call After Created by giving some value" , call);
        setCallDetails(call)
        toast({
          title: "Meeting Created",
        })

        // user clicked a Instant Meeting
        if(!values.description){
          router.push(`/meeting/${call.id}`)
        }
      } catch (error) {
          console.log(error);
          toast({
            title: "Failed to create a meeting",
          })
          
        
      }

        
    }
    console.log("Meeting State" , meetingState);
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4  '>

        <HomeCard className="bg-orange-1" img="/icons/add-meeting.svg" title="New Meeting" desc="Start an Instant Meeting" handleClick={()=>setMeetingState('isInstantMeeting')} />
        <HomeCard className="bg-blue-1" img="/icons/schedule.svg" title="Schedule Meeting" desc="Plan Your Meeting" handleClick={()=>setMeetingState('isScheduleMeeting')} />
        <HomeCard className="bg-purple-1" img="/icons/recordings.svg" title="View Recordings" desc="Check out your Recordings" handleClick={()=>router.push("/recordings")} />
        <HomeCard className="bg-yellow-1" img="/icons/join-meeting.svg" title="Join Meeting" desc="Via Invitation Link" handleClick={()=>setMeetingState('isJoiningMeeting')}/>

        <MeetingModel 
        isOpen={meetingState === 'isInstantMeeting'} 
        onClose={()=>setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
         />

    </section>
  )
}

export default MeetingTypeRoom