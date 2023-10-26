var jwt = require("jsonwebtoken");
var Checkin = require("../models/checkin.model");
// var bcrypt = require("bcrypt");
module.exports.Getcheckin = async (req, res) => {
  
    // try {
    //   const permission = ["owner", "admin", "manager", "employee"];
  
    //   if (!permission.includes(req.user.level)) {
    //     return res.status(403).send({message: "Permission denied"});
    //   }
  
      const checkin = await Checkin.find();
    //   const checkin = [1,2,3,4,5,6,7];
      return res.status(200).send({message: "Get user successfully", data: checkin});
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).send({message: "Internal Server ErrorSSฟฟฟฟ"});
    // }
  };

// 