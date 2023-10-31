var jwt = require("jsonwebtoken");
var Checkout = require("../models/checkout.model");


module.exports.Getcheckout = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager", "employee"];
          if (!permission.includes(req.user.level)) {
        return res.status(403).send({message: "Permission denied"});
      }
        const checkout = await Checkout.find();
        return res.status(200).send({message: "Check Success", data: checkout});
    }catch(error){
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
  };

  module.exports.CreateCheckOut = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager"];

        if (!permission.includes(req.user.level)) {
            return res.status(403).send({message: "Permission denied"});
          }

          var start = new Date();
          start.setHours(0,0,0,0);
          var end = new Date();
          end.setHours(23,59,59,999);
          const chk_checkout = await Checkout.find({timeChackout: {$gte: start, $lt: end},name: req.user.name});
          console.log(chk_checkout);
          if(chk_checkout.length>0){
            return res.status(404).send({message : "คุณลงเวลาออกงานไปแล้ว"});
         }else{
          // return res.status().send({messsage: "Your logined"});
          console.log("ลงเวลาออกงานสำเร็จ");
          let checkoutData = {
            name: req.body.name,
            status: req.body.status == 1 ? "เข้างาน" : "ยังไม่เข้างาน",
            timeChackin: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // userId: req.body.userId, // <<<<<<<<< insert User ID //
        };
 
        const tcheckin = new Checkout(checkoutData);
        const new_tcheckout = await tcheckin.save();
        return res.status(200).send({message: "ลงเวลาออกงานสำเร็จ", data: {new_tcheckout}});
         }
        
    }catch(error){
        return res.status(500).send({message: "Internal Server Error"});
    }
  };