const express=require("express");
const cors=require("cors");

const cookieParser= require("cookie-parser");
const connectDB=require("./DB/db.js")
const app = express();



connectDB().then(()=>{
    app.on("error",(error)=>{
                    console.log("ERR: ", error);
                     throw error
                 })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`sERVER IS RUNNING ON PORT:${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("Mongo db connention failed! ! !",err);
})

app.use(cors());

app.use(express.json({limit:"16kb"}))                                           // to take input file of json
app.use(express.urlencoded({extended:true}))                       // to take input from  url
app.use(express.static("public"))                                              //to store image file in puclic
app.use(cookieParser())                                                         //to store cokkies at server                    

//routes

const userRouter=require("./Routes/user.routes.js");

//routes decleration
app.use("/api/v1/users",userRouter)    //best practice to use api and v1



module.export ={app};