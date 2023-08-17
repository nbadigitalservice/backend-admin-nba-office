var jwt = require('jsonwebtoken');
var { User,validateUser,validateLogin,validateUpdate } = require('../models/user.model');
var bcrypt = require('bcrypt');

//login
module.exports.Login = async (req,res) => {

    try {
        
    const {error} = validateLogin(req.body);
    if(error){
        return res.status(403).send({message:"Data validation failed",error:error.details[0].message})
    }

    const user = await User.findOne({username:req.body.username});

    if(!user){
        return res.status(403).send({message:"User not found"});
    }

    const isValidPassword = await bcrypt.compare( req.body.password,user.password);

    if(!isValidPassword){
        return res.status(403).send({message:"Invalid password"});
    }

    const payload = {
        user_id:user._id,
        name:user.name,
        level:user.level
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'4H'});

    return res.status(200).send({message:'login successful',token:token})

} catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error",error:error.message})
}
}

//register
module.exports.Create = async (req,res) => {

    try {

    const permission = ['owner','admin','manager'];

    if(!permission.includes(req.user.level)){
        return res.status(403).send({message:'Permission denied'});
    }

    const {error} = validateUser(req.body);

    if(error){
        return res.status(403).send({message:"Data validation failed",error:error.details[0].message})
    }

    //save user
    const password = await bcrypt.hash(req.body.password,10);
    let userData = {
        
        name:req.body.name,
        sername:req.body.sername,
        username:req.body.username,
        password:password,
        level:req.body.level,
        department:req.body.department,
        email:req.body.email,
        tel:req.body.tel,
    };
    
    console.log(userData);

    const user = new User(userData);
    const newuser = await user.save();

    return res.status(200).send({message:"User saved successfully",data:newuser});

} catch (error) {
    console.error(error);
        return res.status(500).send({message:"Internal server error",error:error.message});
}

}

//update
module.exports.Update = async (req,res) => {
    try {

        const {error} = validateUpdate(req.body);

    if(error){
        return res.status(403).send({message:"Data validation failed",error:error.details[0].message});
    }

        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).send({message:"User not found"});
        }

    if( req.user.user_id != user._id){
        return res.status(403).send({message:'Permission denied'});
    }

        var password ;

        if(req.body.password){
            password = await bcrypt.hash(req.body.password,10);
        }

        const updateData = {
            name:req.body.name?req.body.name:user.name,
            sername:req.body.sername?req.body.sername:user.sername,
            password:req.body.password?password:user.password,
            email:req.body.email?req.body.email:user.email,
            tel:req.body.tel?req.body.tel:user.tel,
        }

        const result = await User.findByIdAndUpdate(req.params.id,updateData,{returnDocument:'after'});

        return res.status(200).send({message:"updated successfully",data:result});

    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal server error",error:error.message});
    }
}

//delete
module.exports.Delete = async (req,res) => {
    try {

        const permission = ['owner','admin','manager'];

        if(!permission.includes(req.user.level)){
            return res.status(403).send({message:'Permission denied'});
        }

       const result = await User.deleteOne({_id:req.params.id});

       return res.status(200).send(result);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal server error",error:error.message});
    }
}

//get user
module.exports.GetUser = async (req,res) => {
    try {

        const permission = ['owner','admin','manager'];

        if(!permission.includes(req.user.level)){
            return res.status(403).send({message:'Permission denied'});
        }
    

        const user = await User.find();
        return res.status(200).send({message:"Get user successfully",data:user});
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"Internal Server Error"})
    }
}