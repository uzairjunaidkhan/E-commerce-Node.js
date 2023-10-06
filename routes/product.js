const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const Categories = require('../model/Categories');
const mongoose = require('mongoose');
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
        
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // const fileName = file.originalname.split(' ').join('-');
        const fileName = file.fieldname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`) //fileName + '-' + Date.now
        // console.log(`${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })


//create uploadOptions.single('image'),
router.post('/create/new', uploadOptions.single('image'), async (req,res) => {//image is a filde name that will accept files/pictures 
    const category = await Categories.findById(req.body.category)
    if(!category) {
        return res.status(400).send('invalid category')
    }
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const newProduct = new Product({
        name : req.body.name,   
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${fileName}`, //http://localhost:5000/public/upload/image-080723
        images : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        isFeatured : req.body.isFeatured,
        // dateCreated : req.body.dateCreated
    });
    try{
        const savedProduct = await newProduct.save();
        res.status(200).send(savedProduct);
    }
    catch(err){
        res.status(500).send(err + 'the product connot be created')
    }
    //////////
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

//update
router.put('/update/:id', async (req,res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('invalid product id')
    }

    const category = await Categories.findById(req.body.category)
    if(!category) 
    return res.status(400).send('invalid category')

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})//new:true return updated result

    if(!product)
    return res.status(500).send('product cannot be updated')

    res.status(200).send(product)

})

//delete
router.delete('/delete/:id', (req,res) =>{
    Product.findByIdAndRemove(req.params.id).then(Product =>{
        if(Product){
            return res.status(200).json({sucess: true, message: 'the product is deleted'})
        }else
        {
            return res.status(404).json({sucess: false, message: 'the product not found'})
        }
    }).catch(err =>{
        return res.status(400).json({sucess: false, error:err})
    })
})

//read
router.get('/list', async (req,res) =>{
    let filter = {}
    if(req.query.Categories){
        filter = {category: req.query.Categories.split(',')}
    }
    const productlist = await Product.find(filter);
    if(!productlist){
        res.status(500).json({sucess: false})
    }
    res.send(productlist);
})

router.get('/list/selected', async (req,res) =>{
    const productlist = await Product.find().select('name image');//selecting the required fields for optimization
    if(!productlist){
        res.status(500).json({sucess: false})
    }
    res.send(productlist);
})

router.get('/:id', async (req,res) =>{
    const product = await Product.findById(req.params.id).populate('category');//populate show the detail of link collection
    if(!product){
        res.status(500).json({sucess: false})
    }
    res.send(product);
})

router.get('/get/count', async (req,res) =>{
    const productcount = await Product.count()

    if(!productcount){
        res.status(500).json({sucess: false})
    }
    res.send({productcount:productcount})
    
})

router.get('/get/featured/:count', async (req,res) =>{
    const count = req.params.count ? req.params.count : 0 //const age_group = age < 18 ? "Child" : "Adult";
    const productfeatured = await Product.find({isFeatured: true}).limit(+count)
    if(!productfeatured){
        res.status(500).json({sucess: false})
    }
    res.send(productfeatured);
})
module.exports = router;