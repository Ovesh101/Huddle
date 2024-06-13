// For not check types through typescript
// @ts-nocheck

"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "@/components/MeetingCard";
import { useToast } from "./ui/use-toast";
import Loader from "./Loader";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
    const {toast} = useToast();
  const { endedCalls, upcomingCalls, recordingCalls, isLoading } =
    useGetCalls();
  const [recordingCallState, setRecordingCallState] = useState<CallRecording[]>(
    []
  );
  const router = useRouter();
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        console.log("recording call state" , recordingCallState);
        
        return recordingCallState;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };
  const getNoCallMessages = () => {
    switch (type) {
      case "ended":
        return "No Previous Call";
      case "recordings":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
        
        try {
            /*
                  await Promise.all(recordingCalls): Imagine you have a list of requests to check for recordings for each meeting.
                   Promise.all waits for all these requests to complete.
                  .map((meeting) => meeting.queryRecordings()):
                   After all the requests are done, you get the recordings for each meeting by calling queryRecordings() on each one. 
                   This is like getting a list of all the videos for each meeting.
                  */
            const callData = (await Promise.all(recordingCalls)).map((meeting) =>
              meeting.queryRecordings()
      
            );
      
            console.log("Call Data" , callData);
            
      
            /*
            filter(call => call.recordings.length > 0): This filters out any meetings that don't have recordings.
             It's like saying, "Only keep the meetings that actually have videos."
          flatMap(call => call.recordings):
           This takes the list of recordings from each meeting and combines them into a single list of all recordings.
            It's like putting all the videos into one big box.
            */
            const recordings = callData
              .filter(call => call.recordings?.length > 0)
              .flatMap((call) => call.recordings);
      
            setRecordingCallState(recordings);
            
        } catch (error) {
            toast({title:"Please Try Again Later.."})
            
        }
    };

    if (type === "recordings")fetchRecords();
  }, [type, recordingCalls]);

  if (isLoading) return <Loader />;
  const gettingCalls = getCalls();
  const gettingNoCallMessage = getNoCallMessages();
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 ">
      {gettingCalls && gettingCalls.length > 0 ? (
        gettingCalls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description ||
              meeting?.filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              meeting.state?.startsAt.toLocaleString() ||
              meeting.state.start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => router.push(`${meeting.url}`)
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              type === "recordings"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1>{gettingNoCallMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
