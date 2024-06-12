import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
    const router = useRouter();
    const call = useCall();

    const {useLocalParticipant} = useCallStateHooks();
    const localPartcipant = useLocalParticipant();

    const isMeetingOwner = localPartcipant && call?.state.createdBy && localPartcipant.userId === call.state.createdBy.id;
    if(!isMeetingOwner)return null;

  return (
    <Button className='bg-red-500' onClick={async ()=>{
        await call.endCall()
        router.push("/")
    }}>
        End Call For Everyone

    </Button>
  )
}

export default EndCallButton