import pkg from "express"
const app = pkg()
import fs from "fs"
import multer from 'multer'
import Tesseract from 'tesseract.js';
import dotenv from 'dotenv';

dotenv.config()

app.use(pkg.static("public"));

const storage = multer.diskStorage({
    destination: (req,res, cb) => {
        cb(null, "./uploads")
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname)
    }
})
global.baseurl = function(){
	var url = process.env.BASE_URI+":"+process.env.PORT+"/";
    return url;
}
const upload = multer({storage: storage}).single('avatar');
app.set('view engine', "ejs")
app.get("/", (req,res) => {
    res.render("index")
})
app.post("/upload", (req,res) => {
    upload(req,res, err => {
        console.log(req.file.size)
        // 150000
        if(req.file.size >= 1500000){
            res.send("file too large")
        }else{
            fs.readFile(`./uploads/${req.file.originalname}`, (err,data) => {
                if(err) return console.log("error message", err);
                Tesseract
                .recognize(data, "eng", {logger: e => console.log(e)})
                .then(({ data: { text } }) => {
                    var splittext = text.split(" ")
                    res.render("result",{
                        text: text,
                        nik: splittext[splittext.indexOf("nik") + 2]
                    });
                })
            })
        }
    })
})

app.listen(process.env.PORT, (req,res) => {
    console.log("running")
})