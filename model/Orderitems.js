const mongoose = require('mongoose')

const OrderitemSchema = new mongoose.Schema(
    {
        quantity: { type: Number, required: true},
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
    })

OrderitemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

OrderitemSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Orderitems', OrderitemSchema)
