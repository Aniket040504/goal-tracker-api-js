const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require("../model/user");
const asyncHandler=require("express-async-handler");

// @desc Register New User
// @route POST /api/user
// @access Public

const registerUser = asyncHandler(async function registerUser(req, res) {
  
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    //check if user exists

    const userExists=await User.findOne({email});
    if(userExists){
        res.status(404)
        throw new Error("User Already Exists");
    }

    //Hash Password

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt) //password would come from postman/user

    //Create user

    const user=await User.create({
        name,
        email,
        password:hashedPassword
    })

    if(user){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email
        }) 
    }
    else{
        res.status(404)
    throw new Error('Invalid User data')
    }
  });
  

// @desc Authenticate User
// @route POST /api/user/login
// @access Public

const loginUser=asyncHandler(async function loginUser(req,res) {
    const {email,password}=req.body;

    //check for user email
    const user=await User.findOne({email});

    if(user && (await bcrypt.compare(password,user.password))){
        res.json({msg:"successful",
            token:generateToken(user._id)
        })
    }
    else{
        res.status(404)
        throw new Error("Invalid Credentials");
    }
})

// @desc Get User Data
// @route GET /api/user/me
// @access Private

const getUser=asyncHandler(async function getUser(req,res) {
    const {_id,name,email}= await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        name,
        email,
    })
})

// generate JWT
const generateToken=(id)=>{
    return jwt.sign({
        id
    },
    process.env.JWT_SECRETKEY,
    {
        expiresIn:'30d',
    }
)}

module.exports={registerUser,
                loginUser,
                getUser,
};