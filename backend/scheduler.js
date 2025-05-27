import {emailQueue} from "./bullmq.js"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabase_url=process.env.SUPABASE_URL
const supabase_key=process.env.SUPABASE_KEY

const supabase=createClient(supabase_url,supabase_key)

export default async function scheduleUsers({name,email , preferred_time}){
  const [hour,minute]=preferred_time.split(":").map(Number)
  const cronPattern=`${minute} ${hour} * * *`
  const jobId = `daily-job-${email}`;
  try {
    await emailQueue.add(
      "sendEmails",
      {name,email},
      {
        repeat:{
          cron:cronPattern,
          tz:"Asia/Kolkata",
        },
        jobId
      }
    )
    console.log("email scheduled!")
    return {success:true}
  } catch (err) {
    console.log("Failed too schedule the job")
    return {success:false,error:err}
  }
}