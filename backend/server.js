const express=require("express");
const dotenv=require('dotenv').config();
const {errorHandler}=require("./middleware/errorMiddleware")
const port= process.env.PORT || 8000;
const connectDB=require("./config/db");
const goalRouter=require('./routes/goalRoutes');
const userRouter=require('./routes/userRoutes');


connectDB();

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/goals',goalRouter);
app.use('/api/users',userRouter);

app.use(errorHandler);

app.listen(port,()=>console.log(`running on ${port}`));