const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/fileupload";
const File = require('./filemodel');

const app = express();
mongoose.connect(mongoURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({storage});

app.post('/upload', upload.single('file'),async (req, res) => {
    const { filename,path,originalname,mimetype,size}= req.file;
    const newFile = new File({filename,path,originalname,mimetype,size});

    try {
        await newFile.save();
        res.status(201).send(`File uploaded successfully: ${req.file.filename}`);
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
});

app.get('/download/:filename', async (req, res) => {
    console.log(req.params.filename);
    try {
        const file = await File.findOne({filename: req.params.filename});
        if (!file) {
            return res.status(400).send('file not found');
        }
        res.download(file.path, file.originalname);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.listen(3212, ()=>{
    console.log('server is running on port 3212');
});