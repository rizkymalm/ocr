import pkg from "express"
const app = pkg()
import fs from "fs"
import multer from 'multer'
import Tesseract from 'tesseract.js';


const storage = multer.diskStorage({
    destination: (req,res, cb) => {
        cb(null, "./uploads")
    },
    filename: (req,file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage}).single('avatar');
app.set('view engine', "ejs")
app.get("/", (req,res) => {
    res.render("index")
})
app.post("/upload", (req,res) => {
    upload(req,res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err,data) => {
            if(err) return console.log("error message", err);
            Tesseract
            .recognize(data, "eng", {tessjs_create_pdf: '1'})
            .then(({ data: { text } }) => {
                res.send(text);
            })
        })
    })
})

const port = 5001

app.listen(port, (req,res) => {
    console.log("running")
})