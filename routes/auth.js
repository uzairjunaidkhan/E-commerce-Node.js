// const express = require('express');
// const router = express.Router();
// const User = require('../model/User');
// const bcrypt = require('bcrypt');

// router.post('/register', async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashPass = await bcrypt.hash(req.body.password, salt)
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashPass
//         });
//         const user = await newUser.save();
//         res.status(200).json(user);

//     } catch (err) {
//         res.status(500).json(err);

//     }
// })

// router.post('/login', async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email});
//         !user && res.status(400).json("Wrong Credentials");     //if left side is true only than right side will be executed 
        
//         const validated = await bcrypt.compare( req.body.password, user.password);
//         !validated && res.status(422).json("Invalid Password");     //if left side is true only than right side will be executed 
        
//         const { password, ...others} = user._doc; // payload 
//         res.status(200).json(others); 
//     } catch (err) {
//         res.status(500).json(err); 
//     }
// })

// module.exports = router;