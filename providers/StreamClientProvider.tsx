"use client"
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs'; 
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'; 
import { ReactNode, useEffect, useState } from 'react'; 


const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY; 

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>(); // Declaring a state variable for the Stream video client.
  console.log("Video Client", videoClient); // Logging the video client for debugging purposes.
  
  const { user, isLoaded } = useUser(); // Getting the current user and loading status from Clerk.
  console.log("Clerk Logged in User", user); // Logging the user information for debugging purposes.

  useEffect(() => {
    if (!user || !isLoaded) return; // If the user is not loaded, exit the useEffect.
    if (!apiKey) throw new Error("Api key is missing"); // If the API key is missing, throw an error.
    
    const client = new StreamVideoClient({
      apiKey, 
      user: {
        id: user?.id, // Setting the user ID from Clerk.
        name: user?.username || user?.id, // Setting the user name, using ID as a fallback.
        image: user?.imageUrl // Setting the user image URL.
      },
      tokenProvider,
    });
    
    setVideoClient(client)
  }, [user, isLoaded]); 

  if(!videoClient){
    console.log("Loader Occur");
    return <Loader/>
    
  }

  return (
    <StreamVideo client={videoClient}>
      {children}                             
       {/* Rendering children inside the StreamVideo component. */}
    </StreamVideo>
  );
};

export default StreamVideoProvider; // Exporting the StreamVideoProvider component.
