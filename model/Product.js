const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: {type: String, required: true}, //unique: true
        description : {type: String, required: true},
        richDescription : {type: String, default: ''},
        image : {type: String, default: ''},
        images : [{type: String}],
        brand : {type: String, default: ''},
        price : {type: Number, default: 0, required: true}, //required not imp
        category : {type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true},
        countInStock : {type: Number, min: 0, max: 500},
        rating : {type: Number, default: 0,},
        isFeatured : {type: Boolean, default: false},
        dateCreated : {type: Date, default: Date.now} 
    },
    // { timestamps: true}
)

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Product', ProductSchema)
