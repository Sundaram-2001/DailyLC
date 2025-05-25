import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js'
dotenv.config()
const supabase_key=process.env.SUPABASE_KEY
const supabase_url='https://hhrnpmbjwbrbwdxgxfsb.supabase.co'
const supabase=createClient(supabase_url,supabase_key)

console.log("connection established!!")

async function addData(name, email,time){
    const {data,error}=await supabase.from('Emails').insert([
        {name,email,preferred_time:time}
    ])
    if(error){
        console.log("Error inserting the data")
        console.log(error)
        return {success:false,error}
    }
    else{
        console.log("Inserted Data Successfully!!")
        return {success:true,data}
    }
}
export default addData