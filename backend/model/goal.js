const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    goal:{
        type:String,
        required:[true,'Please add a text Value'],
    },
    priority:{
        type:String,
    }
},{
    timestamps:true,
}
)

const goalData=mongoose.model("goals",userSchema);

module.exports=goalData;