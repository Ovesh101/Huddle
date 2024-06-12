"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
/*
Import Required Modules: Prepare the tools and personnel.
Set Up API Keys: Get the keys for the pass-making machine.
Define Token Provider Function: Start the process of issuing a pass.
Get Current User: Check your ID.
Check for User and Keys: Ensure everything needed is available.
Create Stream Client: Access the pass-making machine.
Calculate Expiry and Issued Time: Set the validity period for the pass.
Create the Token: Generate the temporary access pass.
Return the Token: Hand over the pass.
*/
export const tokenProvider =  async ()=>{
    const user = await currentUser();

    if(!user) throw new Error("User is not logged in...");
    if(!apiKey) throw new Error("No API Key");
    if(!apiSecret) throw new Error("No API secret key");
    const client = new StreamClient(apiKey ,apiSecret);
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    const issued = Math.floor(Date.now() / 1000) - 60

    const token = client.createToken(user.id , exp , issued);

    return token



}