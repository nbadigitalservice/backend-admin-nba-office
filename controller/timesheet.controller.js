var jwt = require("jsonwebtoken");
var Timesheet = require("../models/timesheet.model");
// var bcrypt = require("bcrypt");
module.exports.GetTimesheet = async (req, res) => {
  
    // try {
    //   const permission = ["owner", "admin", "manager", "employee"];
  
    //   if (!permission.includes(req.user.level)) {
    //     return res.status(403).send({message: "Permission denied"});
    //   }
  
      // const timesheet = await Timesheet.find();
      const timesheet = await [1,2,3,4,5,6,7];
      // const timesheet = await Timesheet.find();
      return res.status(200).send({message: "Get user successfully", data: timesheet});
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).send({message: "Internal Server ErrorSS"});
    // }
  };