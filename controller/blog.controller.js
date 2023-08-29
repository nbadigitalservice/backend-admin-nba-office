var {Blog} = require("./../models/blog.model");
var { uploadFileCreate,deleteFile } = require("./../lib/uploadservice");
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

// get User blog by id
module.exports.GetUserBlogById = async (req,res) => {
    try {
        const id = req.params.id
        const blogs = await Blog.findById(id)
        
        if (!blogs) {
            return res.status(403).send({ message: 'ไม่พบข้อมูล blog ที่ค้นหา' })
        }

        const pipeline = [
            {
                $match: { "_id": blogs._id }
            },
            {
                $addFields: {
                    blogId: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "blogmessages",
                    localField: "blogId",
                    foreignField: "blog_id",
                    as: "comments"
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    title: 1,
                    description: 1,
                    imgUrl: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: "$comments.message"
                }
            }
        ]

        const blogsWithMessages = await Blog.aggregate(pipeline).exec()

        return res.status(200).send({ message:"Get User Blog Success", data:blogsWithMessages });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",data:error});
    }
}


//delete blog from user
module.exports.DeleteBlog = async (req,res) => {
    try {

        //get user blog by id from url parameter
        const userBlog = await Blog.findOne({_id:req.params.id});

        if(!userBlog){
            return res.status(404).send({message:'blog not found'})
        }

        if(userBlog && userBlog.user_id !== req.user.user_id){
            return res.status(403).send({message:"User not permitted to delete this blog"});
        }

        //delete all blog images

        for(const image of userBlog.imgUrl){
            await deleteFile(image.imageId);
        }

        //delete blog
        const result = await Blog.deleteOne({_id:req.params.id},{includeResultMetadata: false});

        return res.status(200).send({message:"delete blog successfully",data:result});

        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",data:error.message});
    }
}

//delete blog image
module.exports.DeleteBlogImage = async (req,res) => {
    try {

        await deleteFile(req.params.id);

        return res.status(200).send({message:"delete blog image successfully"});
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",data:error.message});
    }
}

module.exports.GetAllBlog = async (req, res) => {
    try {
        const pipeline = [
            {
                $addFields: {
                    blogId: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "blogmessages",
                    localField: "blogId",
                    foreignField: "blog_id",
                    as: "comments"
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    title: 1,
                    description: 1,
                    imgUrl: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: "$comments.message"
                }
            }
        ]

        const blogsWithMessages = await Blog.aggregate(pipeline).exec()

        return res.status(200).send({ message: 'ดึงข้อมูลสำเร็จ', data: blogsWithMessages })
    } catch (error) {
        console.error("Error:", error)
        return res.status(500).send({ message: "Internal server error", data: error })
    }
}