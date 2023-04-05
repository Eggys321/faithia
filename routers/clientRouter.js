const express = require('express')
const router = express.Router()
const userModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// router.get('/', (req, res) => {
//   res.send('we heree')
// })
// router.get('/post',(req,res)=>{
//     res.send('we dn create post route')
// })


// Register route
router.post('/register', async (req, res) => {
  // console.log(req.body);
  // res.send('we testing')
  try {
    const { email, password, passwordVerify } = req.body
    if (!email || !password || !passwordVerify) {
      return res.json({ errorMessage: 'please enter all required fields' })
    }
    if (password.length < 6) {
      return res.json({
        errorMessage: 'please password must be atleast 6 chrs',
      })
    }
    if (password !== passwordVerify) {
      return res.json({ errorMessage: 'please enter thesame password twice' })
    }
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.json({ errorMessage: 'An acct wii dsame email already eists' })
    }
    // harsh d pwd
    const salt = await bcrypt.genSalt()
    const harshedPassword = await bcrypt.hash(password, salt)
    console.log(harshedPassword)
    // Save a new user acct to DB
    const newUser = new userModel({ email, harshedPassword })
    const savedUser = await newUser.save()
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRETE
    )
  console.log('registerd successfully');
    console.log(token)
    // So lets save d token usin cookie,we can also use local storage but we wud use cookie
    res.cookie('token',token,{
      httpOnly:true

    }).send()
  } catch (err) {
    console.log(err)
  }
})

// Login route

router.post('/login',async(req,res)=>{
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ errorMessage: 'please enter all required fields' })
    }
    const existingUser = await userModel.findOne({ email })
     if (!existingUser) {
       return res.json({
         errorMessage: 'Wrong email or password',
       })
     }
     const passwordCorrect = await bcrypt.compare(password,existingUser.harshedPassword)

     if(!passwordCorrect){
      return res.json({errorMessage:'wrong email or password'})
     }
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRETE
      )
      console.log(token);
      console.log('logged in successfully');
      res.cookie('token',token,{
        httpOnly:true
      }).send()
      console.log('logged in successfully');
    
  } catch (err) {
    console.log(err)
  }

})

// logout route
router.get('/logout',(req,res)=>{
  console.log('logged out successfully');
  res.cookie('token',"",{
    httpOnly:true,
    expires:new Date(0)
  }).send()
})


module.exports = router
