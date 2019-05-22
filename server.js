const multer = require('multer');
const multerS3 = require('multer-s3');  
const aws = require('aws-sdk');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ejs = require('ejs');
dotenv.config();
aws.config.update({
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    accessKeyId:process.env.ACCESS_KEY_ID,
    region:'us-east-2'
})
console.log(process.env.SECRET_ACCESS_KEY);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'sweet-store',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'META_DATA_ITEMS'});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

 const singleUpload = upload.single('image');
app.get('/image-upload', (req, res, next)=>{
   res.render('images');
})
app.post('/image-upload', function(req, res) {
    console.log(req.body)
  singleUpload(req, res, function(err, some) {
    console.log(req.body)
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }

    return res.json({'imageUrl': req.file.location, "name":req.body.name});
  });
})
  
  app.listen(3001);