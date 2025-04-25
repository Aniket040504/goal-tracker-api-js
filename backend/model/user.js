const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Enter your name'],
    },
    email:{
        type:String,
        required:[true, 'Please Enter your email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true, 'Please Enter a strong Password'],
    },
},
{
    timestamps:true,
}
);

const userData=mongoose.model('User',userSchema);

module.exports=userData;