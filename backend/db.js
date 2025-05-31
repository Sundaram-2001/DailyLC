import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function addData(name, email, time) {
  const { data, error } = await supabase
    .from("Emails")
    .insert([{ name, email, preferred_time: time }]);

  if (error) {
    
    console.error("Error inserting data:");
    console.dir(error, { depth: null, colors: true });

   
    const errorMessage = error.message || JSON.stringify(error) || "Unknown error";
    return { success: false, error: errorMessage };
  }

  return { success: true, data };
}
