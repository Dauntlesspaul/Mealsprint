const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
imageurl:{
    type: String,
    required:true
},
name: {
   type: String,
   required: true
},
price: {
    type: Number,
    required: true
 },
category:{
    type:String,
    required:true
},
section:{
    type:String,
},
 description: {
    type: String,
    required: true
 },
 createdAt: {
    type: Date,
    default: Date.now
},
updatedAt: {
    type: Date,
    default: Date.now
}
})
module.exports = mongoose.model("Foods",foodSchema);