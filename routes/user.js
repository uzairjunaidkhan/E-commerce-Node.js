const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/login', async (req,res) => {
    const key = process.env.key
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send('user not found!')
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        },
        key,          //key
        {expiresIn: '1d'})

        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('password is wrong!');
    }
       
})

//create
router.post('/create', async (req,res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country    
    })

    try{
        let savedUser = await newUser.save()
        res.status(200).send(savedUser)
    }catch(err){
        res.status(500).send(err)
    }
})

//read
router.get('/list', async (req,res) => {
    try{
        let user = await User.find().select('-passwordHash')
        res.status(200).send(user)
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/:id', async (req,res) => {
    try{
        let user = await User.findById(req.params.id).select('-passwordHash')
        res.status(200).send(user)
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/get/count', async (req,res) =>{
    const userCount = await User.count()

    if(!userCount){
        res.status(500).json({sucess: false})
    }
    res.send({userCount:userCount})
    
})

//update
router.put('/:id', async (req, res) => {
    if(req.body.id == req.params.id)
    {
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                username: req.body.username,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password,10),
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country    
            },
            {
                new: true
            });
            res.status(200).json(updatedUser); 
        }catch(err){
            res.status(500).json(err); 
        }
    }else{
        res.status(401).json("you can only update your profile"); 
    }
})

//delete
router.delete('/delete/:id', (req,res) =>{
    User.findByIdAndRemove(req.params.id).then(User =>{
        if(User){
            return res.status(200).json({sucess: true, message: 'the User is deleted'})
        }else
        {
            return res.status(404).json({sucess: false, message: 'the User not found'})
        }
    }).catch(err =>{
        return res.status(400).json({sucess: false, error:err})
    })
})

module.exports = router;