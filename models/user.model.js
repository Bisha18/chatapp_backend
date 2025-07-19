import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    minLength:[4, "Username must be at least 4 characters long"],
    unique:true
  },
  email:{
     type:String,
     required:true,
     unique:true,
     match:[/.+@.+\..+/, "Please enter a valid email address"],
  },
  password:{
    type:String,
    required:true,
    minLength:[6, "Password must be at least 6 characters long"]
  }
},{timestamps: true})


export default mongoose.model("User", userSchema);