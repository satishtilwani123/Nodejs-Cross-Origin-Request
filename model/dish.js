const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Comment = new Schema({
    comment: {
        type: String,
        required: true
    }, 
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
})

var DishSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    amount: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comments: [Comment]
}, {
    timestamps: true
})

DishModel = mongoose.model('dish', DishSchema);
module.exports = DishModel;