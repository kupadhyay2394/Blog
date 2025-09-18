const express=require("express");
const cors=require("cors");

const cookieParser= require("cookie-parser");
const connectDB=require("./DB/db.js")
const app = express();
const dotenv= require('dotenv')
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173', // Your local frontend
  'https://blog-tan-ten-50.vercel.app' // Your deployed Vercel URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // The 'origin' is the URL of the site making the request (e.g., your Vercel app)
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the configured cors options
app.use(cors(corsOptions));


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



app.use(express.json({limit:"16kb"}))                                        
app.use(express.urlencoded({extended:true}))                     
app.use(express.static("public"))                                              
app.use(cookieParser())                                                        

//routes

const userRouter=require("./Routes/user.routes.js");
const postRouter = require("./Routes/post.routes.js");


//routes decleration
app.use("/api/v1/users",userRouter); 
app.use("/api/v1/post",postRouter);   



module.export ={app};