const express = require("express")
require("./connection")
const port = process.env.PORT
const multer = require("multer")
const bcrypt = require("bcryptjs")
const user = require("./schema")
const pics = require("./schema1")
const app = express()
app.use(express.static("static"))
app.use(express.urlencoded())
app.set("view engine","hbs")
app.set("views",(__dirname,"./public"))
login = ""
logmail = ""

app.get("",(req,res) => {
    res.render("login",{})
})

app.get("/signup",(req,res) => {
    res.render("signup",{})
})

app.post("/sign",async(req,res) => {
    req.body.password = await bcrypt.hash(req.body.password,8)
    const User = await new user(req.body)
    await User.save().then(() => {
        res.render("login",{})
    }).catch(() => {
        res.render("404",{
            "error":"User Already exist or You have not filled all the details.",
            "back":"/signup"
        })
    })
})

app.get("/ver",async(req,res) => {
    const User = await user.find({"email":req.query.email})
    if(JSON.stringify(User) == "[]")
    {
        res.render("404",{
            "error":"User Not Found.Invalid Credentials.",
            "back":"/"
        })
    }
    else
    {
    const match = await bcrypt.compare(req.query.password,User[0].password)
    if(match)
    {
        login = User[0].name
        logmail = User[0].email
        res.render("upload",{
            "name":User[0].name,
            "email":User[0].email
        })
    }
    else
    {
        res.render("404",{
            "error":"User Not Found.Invalid Credentials.",
            "back":"/"
        })
    }
}
    
})

app.get("/ver1",async(req,res) => {
    const User = await user.find({"email":req.query.email})
    if(JSON.stringify(User) != "[]")
    {
        login = User[0].name
        logmail = User[0].email
        res.render("upload",{
            "name":User[0].name,
            "email":User[0].email
        })
    }
    else
    {
        res.render("404",{
            "error":"User Not Found.Invalid Credentials.",
            "back":"/"
        })
    }
})

var upload = multer({
    dest:"./static/Images/",
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.endsWith(".jpg") && !file.originalname.endsWith(".jpeg") && !file.originalname.endsWith(".png"))
        {
            return cb(new Error("File of Wrong Format"))
        }
        cb(undefined,true)
    },
    filename(req,file,cb)
    {
        cb(undefined,`${file.originalname}`)
    }
})

app.post("/upld",upload.single(`uploads`),async(req,res) => {
    const Pics = await pics.find({"email":logmail})
    if(req.file)
    {
    req.body.uploads = req.file.filename
    if(JSON.stringify(Pics) == "[]")
    {
        const upl = Buffer.from(req.body.uploads)
        const pcs = await new pics({"email":logmail,"uploads":upl})
        await pcs.save()
        res.render("upload",{
                "name":login,
                "email":logmail
        })
    }

    else
    {
        var pcs = [...Pics[0].uploads]
        pcs.push(Buffer.from(req.body.uploads))
        const pc = await pics.update({"email":logmail},{$set:{"uploads":pcs}})
        res.render("upload",{
            "name":login,
            "email":logmail
        })        
    }
}
else
{
    res.render("404",{
        "error":"Please upload the file",
        "back":`/ver1?email=${logmail}`
    })
}
},(error,req,res,next) => {
    res.render("404",{
        "error":error.message,
        "back":`/ver1?email=${logmail}`
    })
})

app.get("/collec",async(req,res) => {
    const Pics = await pics.find({"email":req.query.email})
    if(JSON.stringify(Pics) != "[]")
    {
        const sec = []
        for(let i=0;i<Pics[0].uploads.length;i++)
        {
            sec.push(Pics[0].uploads[i].toString())
        }
    res.send({
        "pics":sec
    })
}
})
app.get("/logout",(req,res) => {
    login = ""
    logmail = ""
    res.render("login",{})
})

app.listen(port,(req,res) => {
    console.log("Server is running on Port " + port)
})
