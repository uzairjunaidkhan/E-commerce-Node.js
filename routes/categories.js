const express = require('express');
const router = express.Router();
const Categories = require('../model/Categories');

//read
router.get('/list', async (req,res) =>{
    const categorieslist = await Categories.find();
    if(!categorieslist){
        res.status(500).json({sucess: false})
    }
    res.status(200).send(categorieslist);
})

router.get('/:id', async (req,res) =>{
    const category = await Categories.findById(req.params.id);
    if(!category){
        res.status(500).json({sucess: false, message: 'category not found'})
    }
    res.status(200).send(category);
})

//create
router.post('/create', async (req,res) =>{
    let category = new Categories(req.body)
    category = await category.save();
    
    if(!category)
    return res.status(404).send('category cannot be created!')

    res.send(category)
})

//delete
router.delete('/delete/:id', (req,res) =>{
    Categories.findByIdAndRemove(req.params.id).then(Categories =>{
        if(Categories){
            return res.status(200).json({sucess: true, message: 'the category is deleted'})
        }else
        {
            return res.status(404).json({sucess: false, message: 'the category not found'})
        }
    }).catch(err =>{
        return res.status(400).json({sucess: false, error:err})
    })
})

//update
router.put('/update/:id', async (req,res) =>{
    const category = await Categories.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!category)
    return res.status(404).send('category cannot be updated!')

    res.send(category)
})

module.exports = router;