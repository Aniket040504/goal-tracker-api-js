const Goal=require("../model/goal");
const asyncHandler=require("express-async-handler");

// @desc Get Goals
// @route GET /api/goals
// @access private
const getGoals=asyncHandler(async function getGoals(req,res) {
  const goals= await Goal.find({user:req.user.id}); 
  if(!goals){
    res.status(404)
    throw new Error("No Goals Exist")
  }
  res.status(202).json(goals);
})


// @desc Set Goal
// @route POST /api/goals
// @access private
const createGoal=asyncHandler(async function createGoal(req,res) {
  if(!req.body.goal){
    res.status(400)
    throw new Error('Please add something');
  }
  try {
    const existing = await Goal.findOne({ goal: req.body.goal, user:req.user.id });
    if (existing) {
      throw new Error(`Goal: ${req.body.goal} already exists`);
    }
 
  const goal=await Goal.create({
    goal:req.body.goal,
    priority:req.body.priority,
    user:req.user.id
  })
  res.status(202).json({
    msg:'success',
    goal:goal,
});

} catch(error){
  if (error.code === 11000) {
    res.status(400);
    throw new Error(`Goal "${req.body.goal}" already exists`);
  }
  throw error;
}
})


// @desc Update Goal
// @route UPDATE /api/goals/:id
// @access private

const updateGoal = asyncHandler(async function (req, res) {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  //if goal belongs to logged in user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(202).json({ msg: "Goal updated successfully", goal: updatedGoal});
});


// @desc Delete Goal
// @route DELETE /api/goals/:id
// @access private
const deleteGoal = asyncHandler(async function (req, res) {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

 //checl goal belongs to logged in user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await goal.deleteOne();

  res.status(200).json({ msg: 'Goal Deleted', goal });
});


module.exports={
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
}