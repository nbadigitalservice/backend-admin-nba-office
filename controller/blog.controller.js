var {Blog} = require("./../models/blog.model");
var { uploadFileCreate } = require("./../lib/uploadservice");
const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
     //console.log(file.originalname);
  },
});



//create blog
module.exports.Create = async (req,res) => {

    const upload = multer({ storage: storage }).array("img", 20);

  upload(req, res, async function (err) {
    if(err){
        return res.status(400).send({message:"upload failed",err:err});
    }

    //upload
    const reqFiles = []
    const image = [];
    const files = req.files;
    for(let i=0; i<files.length; i++){
        
     const result =  await uploadFileCreate(req.files, res, { i, reqFiles });
        image.push(result);
    };

    console.log(image);
    return res.send(image);

  })

}