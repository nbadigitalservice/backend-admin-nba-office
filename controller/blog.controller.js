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

    try {
        
    

    const upload = multer({ storage: storage }).array("img", 20);

  upload(req, res, async function (err) {
    if(err){
        return res.status(400).send({message:"upload failed",err:err});
    }

    //upload
    const image = [];
    const files = req.files;
    for(let i=0; i<files.length; i++){
        
     const result =  await uploadFileCreate(req.files, res, i);
        image.push(result);
    };

    console.log('image',image);

    const requresData = {
        user_id:req.user.user_id,
        title:req.body.title,
        description:req.body.description,
        imgUrl:image
    }

    try {
        
        const blog = new Blog(requresData);
        const result = await blog.save();
        return res.status(200).send({message:'บันทึกสำเร็จ',data:result});

    } catch (error) {
        return res.status(400).send({message:'Mongo error',data:error});
    }

  });

} catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal Server Error",data:error});  
}

}

// get User blog
module.exports.GetUserBlog = async (req,res) => {
    try {
        const userBlog = await Blog.find({user_id:req.user.user_id});

        return res.status(200).send({message:"Get User Blog Success",data:userBlog});
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",data:error});
    }
}