"use client"
import React, { useState } from 'react'

import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'

const MeetingTypeRoom = () => {
    const router = useRouter();
    const createMeeting = ()=>{
        
    }
   
    
    const [meetingState , setMeetingState] = useState<"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined>()
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