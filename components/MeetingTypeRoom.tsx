"use client"
import React, { useState } from 'react'
import { useToast } from './ui/use-toast'

import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

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
        // Meeting room ID
        const id = crypto.randomUUID();
        //  creating call object
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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4  '>

        <HomeCard className="bg-orange-1" img="/icons/add-meeting.svg" title="New Meeting" desc="Start an Instant Meeting" handleClick={()=>setMeetingState('isInstantMeeting')} />
        <HomeCard className="bg-blue-1" img="/icons/schedule.svg" title="Schedule Meeting" desc="Plan Your Meeting" handleClick={()=>setMeetingState('isScheduleMeeting')} />
        <HomeCard className="bg-purple-1" img="/icons/recordings.svg" title="View Recordings" desc="Check out your Recordings" handleClick={()=>router.push("/recordings")} />
        <HomeCard className="bg-yellow-1" img="/icons/join-meeting.svg" title="Join Meeting" desc="Via Invitation Link" handleClick={()=>setMeetingState('isJoiningMeeting')}/>

        {/* Is Schedule meeting model */}
        {!callDetails ? (
            <MeetingModel 
            isOpen={meetingState === 'isScheduleMeeting'} 
            onClose={()=>setMeetingState(undefined)}
            title="Create a Meeting"
         
            handleClick={createMeeting}
             >
              <div className='flex flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2 '>Add a Description</label>
                <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-1' 
                onChange={(e)=>setValues({...values , description:e.target.value})}
                 />

              </div>
              <div className='flex w-full flex-col gap-2.5  '>
              <label className='text-base text-normal leading-[22px] text-sky-2 '>Select a Date and Time</label>
              <ReactDatePicker 
              selected={values.dateTime}
              onChange={(date)=>setValues({...values , dateTime:date!})}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='w-full rounded bg-dark-3 p-2 focus:outline-1'
              
              />
              </div>

            </MeetingModel>

        ) : (
          <MeetingModel 
          isOpen={meetingState === 'isScheduleMeeting'} 
          onClose={()=>setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={()=>{
            navigator.clipboard.writeText(meetingLink);
            toast({title:"Link Copied"});
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          
           />

        )}
        <MeetingModel 
        isOpen={meetingState === 'isInstantMeeting'} 
        onClose={()=>setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
         />
        <MeetingModel 
        isOpen={meetingState === 'isJoiningMeeting'} 
        onClose={()=>setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=> router.push(values.link) }
         >
          <Input placeholder='Meeting Link'
           className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-1'
           onChange={(e)=>setValues({...values , link:e.target.value})}
            />
         </MeetingModel>

    </section>
  )
}

export default MeetingTypeRoom