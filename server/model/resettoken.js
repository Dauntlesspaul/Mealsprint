const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetTokenSchema = new Schema({
    email:{type: String,
        unique: true,
    },
    token:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 3600
    }
})

module.exports = mongoose.model('ResetToken',ResetTokenSchema)