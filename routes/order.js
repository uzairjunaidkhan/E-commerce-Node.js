const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../model/Order');
const Orderitems = require('../model/orderitems');
// const orderitems = require('../model/orderitems');

//read
router.get('/list', async (req, res) =>{
    const orderlist = await Order.find().populate('user', 'username').sort({orderDate: -1})
    if(!orderlist){
        res.status(500).json({sucess: failed})
    } 
    res.send(orderlist)
})

router.get('/:id', async (req, res) =>{
    const orderId = await Order.findById(req.params.id)
    .populate('user', 'username').populate({path:'orderItems', populate:{
        path:'product', populate:'category'
    }});
    if(!orderId){
        res.status(500).json({sucess: failed})
    } 
    res.send(orderId)
})

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})

router.get('/get/count', async (req, res) =>{
    const orderCount = await Order.count()

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

router.get('/get/userorders/:id', async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.id})
    .populate({ 
        path: 'orderItems', populate: { path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});
// bug category is not populating
    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})


//update
router.put('/update/:id', async (req,res) =>{
    const order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status
        }, {new: true})
    if(!order)
    return res.status(404).send('order cannot be updated!')

    res.send(order)
})

//create
router.post('/create', async (req,res) =>{
    const orderItemIds = Promise.all(req.body.orderItems?.map(async orderItem =>{
        let newOrderItem = new Orderitems({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;    
    }))
    orderItemIdsResolved = await orderItemIds;

    const totalPrices = await Promise.all(orderItemIdsResolved.map(async (orderItemIds) =>{
        const orderItem = await Orderitems.findById(orderItemIds).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b)=> a+b, 0)
    
    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user 
    })
    order = await order.save();
    
    if(!order){
        return res.status(404).send('order cannot be created!')
    }
    res.send(order)
})

//delete
router.delete('/delete/:id', (req,res) =>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order){
            await order.orderItems?.map(async orderitem =>{
                await Orderitems.findByIdAndRemove(orderitem)
            })
            return res.status(200).json({sucess: true, message: 'the order is deleted'})
        }else
        {
            return res.status(404).json({sucess: false, message: 'the order not found'})
        }
    }).catch(err =>{    
        return res.status(400).json({sucess: false, error:err})
    })
})

module.exports = router;