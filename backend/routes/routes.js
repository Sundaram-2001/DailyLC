import express from "express"
import addData from "../db.js"
const routes=express.Router()

routes.post("/",async(req,res)=>{
    const {name,email,time}=req.body
    const result=await addData(name,email,time)
    if (result.success) {
    res.status(200).json({ message: "Data inserted successfully!" });
  } else {
    res.status(500).json({ message: "Insert failed", error: result.error });
  }
});
export default routes