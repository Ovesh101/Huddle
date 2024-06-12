import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

  

export const useGetCallById =  (id:string | string[])=>{

        //  access meeting room details using ID    
        // Access the community center's database (client).
        // Look up the room using its ID.
        // Store the room details for later use.
        // Indicate whether the search is still in progress or completed.
    const [call , setCall] = useState<Call>()
    const [isCallLoading , setIsCallLoading] = useState(true);
    const client = useStreamVideoClient();
    useEffect(()=>{
        if(!client) return;
        const loadCall = async ()=>{
            const {calls} = await client.queryCalls({
                filter_conditions:{
                    id
                }
            })
            console.log("Calls" , calls);
            
            if(calls.length > 0) setCall(calls[0])
                setIsCallLoading(false)
        }
        loadCall()
        console.log("Call loading use effecyt" , call);
        

    } , [client , id])

    return {call , isCallLoading}
}

