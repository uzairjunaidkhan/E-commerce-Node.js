const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
    {
        orderItems : [{type: mongoose.Schema.Types.ObjectId, ref: 'Orderitems', required: true}],

        shippingAddress1: { type: String, required: true },
        shippingAddress2: { type: String},
        city: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        status: { type: String, required: true, default: 'pending' },
        totalPrice: { type: Number },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        orderDate: { type: Date, default: Date.now }
    })

OrderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

OrderSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Order', OrderSchema)
