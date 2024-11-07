const mongoose=require('mongoose')
const studentSchema=new mongoose.Schema({
   username:{
    type:String,
    required:true,
    unique:true
   },
   name:{
    type:String,
    required :true
   },
   age:{
    type:Number,
    required:true
   },
   course:{
    type:String
   },
   grade:{
    type:String
   }
});
module.exports=mongoose.model('student',studentSchema)
