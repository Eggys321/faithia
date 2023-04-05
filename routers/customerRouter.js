const express = require('express')
const router = express.Router()
const customerModel = require('../model/customerModel')
const auth = require('../middleware/auth')

router.post('/', auth, async(req,res)=>{
    try{
        const {name} = req.body
        const newCustomer = new customerModel({
            name
        })
        const savedCustomer = await newCustomer.save()
        res.json(savedCustomer)

    }
    catch(error){
        console.log(error);

    }

})

// find all customers
router.get('/allCustomers',auth, async (req,res)=>{
    try {
      const allCustomers = await customerModel.find()
      res.json(allCustomers)
    } catch (error) {
      console.log(error)
    }
})

module.exports = router