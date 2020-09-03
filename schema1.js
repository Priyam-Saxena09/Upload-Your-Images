const mongoose = require("mongoose")

const schema1 = new mongoose.Schema({
    email:
    {
        type:String,
        required:true
    },
    uploads:
    {
        type:Array,
        required:true
    }
})

const pics = mongoose.model("pics",schema1)
module.exports = pics