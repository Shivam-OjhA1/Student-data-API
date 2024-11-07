const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Student = require('./models/students')
const Joi = require('joi');
//Starting Server --------

const PORT = 4001;
app.listen(PORT, (res) => {
    console.log("Port listening succesfully=", PORT);

})
app.get('/',(req,res)=>{
    res.send("Hello I am live")
})


// Database connection---------

mongoose.connect('mongodb://localhost:27017/studentDB').then(
    ()=>console.log('Connected to mongodb'))
    .catch(err=>console.error('Could not connect to db ',err))
    

// Middleware (Express)--------------

app.use(express.json())

//logging and monitoring
const morgan = require('morgan');
app.use(morgan('combined'));


// Rest Api Routes-------------

app.post('/students',async(req,res)=>{
    try {
        const student=new Student(req.body)
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({message:error.message});
    }

});

    //Get all students-------

app.get('/students', async(req,res)=>{
    try {
        const students=await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({message:error.message})
    }

});

   // Get Student by Username(GET)-------------
 app.get('/students/username/:username',async(req,res)=>{
    try {
        const student=await Student.findOne({
            username:req.params.username
        });
        if (student) {
            res.json(student)
            
        } else {
            res.status(404).json({message:"Student not found"});
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
 })

   // Get Student data by name(GET)-----------

   app.get('/students/name/:name',async(req,res)=>{
    try {
        const student=await Student.findOne({
            name:req.params.name
        });
        if (student) {
            res.json(student)
            
        } else {
            res.status(404).json({message:"Student not found"});
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
 });

 // Update student information

 app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete a student (Delete)

app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (student) {
            res.json({ message: 'Student deleted' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Data validation and Error Handling



const studentSchema = Joi.object({
    username: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().integer().min(16).max(100),
    course: Joi.string(),
    grade: Joi.string().valid('A', 'B', 'C', 'D', 'F')
});

app.post('/students', async (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
});

