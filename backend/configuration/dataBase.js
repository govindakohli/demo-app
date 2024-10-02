import mongoose from "mongoose";

const  connectDatabase = async ()=>{
    await mongoose.connect(process.env.DB_URI) 
     .then((data)=>{
               console.log(`MongoDB connected`)})
     .catch((err)=>{console.log(err)});
}

export default connectDatabase;