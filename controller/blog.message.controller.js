var {BlogMessage} = require("../models/blog.message.model");

module.exports.CreateBlogMessage = async (req,res) => {
    try {

        const data = {
            member_name:req.user.name,
            blog_id: req.params.id,
            message:req.body.message
        }

        const message = new BlogMessage(data);
        
        const result = await message.save();
        return res.status(200).send({message:"comment successfully",data:result});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",data:error.message})
    }
}