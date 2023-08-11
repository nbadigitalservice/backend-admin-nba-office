const jwt = require('jsonwebtoken');

async function AuthorizeUser(req,res,next){
    const token = req.headers['token'];
    if(!token){
        return res.status(403).send({message:'Invalid authorized method'});
    }

jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
    if(err){
        return res.status(400).send({message:'Permission denied'});
    }

    req.user = decoded;
    next();

});

  
}

module.exports = {AuthorizeUser};