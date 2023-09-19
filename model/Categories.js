const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema({
    name : {type: String, required: true},
    icon : {type: String},
    color : {type: String}
})

CategoriesSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

CategoriesSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Categories', CategoriesSchema)
