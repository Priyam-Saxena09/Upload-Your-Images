const mongoose = require("mongoose")
mongoose.connect(process.env.database,{
    useNewUrlParser:true,
    useCreateIndex:true
})