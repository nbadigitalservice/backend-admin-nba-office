var jwt = require("jsonwebtoken");
var Timesheet = require("../models/timesheet.model");
var Checkin = require("../models/checkin.model");
var {
    User,
    validateUser,
    validateLogin,
    validateUpdate,
  } = require("../models/user.model");
  var bcrypt = require("bcrypt");

module.exports.GetTimesheet = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager", "employee"];
  
        if (!permission.includes(req.user.level)) {
          return res.status(403).send({message: "Permission denied"});
        }
        const getDataTimesheet = await Timesheet.find();
        /* --------------------- Check Data ---------------------*/

        var Datenow = new Date().toISOString();
        var Today = Datenow.slice(0,10);
        var Time = Datenow.slice(11,19);
        const chk_checkout = await Timesheet.find({$and:[{workDate: Today, name: req.user.name,checkout: null,userId: req.user.user_id}]});
        // console.log(chk_checkout);

        if(chk_checkout.length > 0) {
            console.log("ยังไม่ได้ลงชื่อออกงาน")
            const resultCheckout = await Timesheet.findAndModify({query:{userId: req.user.user_id},update: {$inc:{checkout: Time}}});
            console.log(resultCheckout);
            return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ", data: resultCheckout});
        }else{
            console.log("ออกงานแล้ว");
            return res.status(200).send({message: "คุณลงชื่อออกงานแล้ว"});
        }
         /* -----------------------------------------------------*/

        
        
        
    }catch(error){
        res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports.CreateCheckin = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager"];

        if (!permission.includes(req.user.level)) {
            return res.status(403).send({message: "Permission denied"});
          }
          var Datenow = new Date().toISOString();
          var Today = Datenow.slice(0,10);
          var Time = Datenow.slice(11,19);
        const getUserId = await User.findOne({name: req.user.name}).select("_id");

        const chk_checkin = await Timesheet.find({$and:[{workDate: Today, name: req.user.name}]});

        if(chk_checkin.length > 0){
            return res.status(200).send({message: "คุณลงเวลาทำงานแล้ว"});
        }else{
            let CheckinTime = {
                name: req.user.name,
                workDate : Today,
                checkin : Time,
                checkout : null,
                total : null,
                ot : null,
                userId: req.user.user_id,
            };
            const nCheckin = new Timesheet(CheckinTime);
            const Checkin = await nCheckin.save();
            return res.status(200).send({message: "ลงเวลาทำงานสำเร็จ", data: Checkin});
        }

       
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports.CreateCheckout = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager"];

        if (!permission.includes(req.user.level)) {
            return res.status(403).send({message: "Permission denied"});
          }
          
    }catch{

    }
}

module.exports.GetReport = async (req, res) => {

    try{

        const permission = ["owner", "admin", "manager", "employee"];

        if (!permission.includes(req.user.level)) {

          return res.status(403).send({message: "Permission denied"});
        }

        const data = await Timesheet.find({
            
        });

        return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ", data: "Hello"});

        // const getDataTimesheet = await Timesheet.find();
        // /* --------------------- Check Data ---------------------*/

        // var Datenow = new Date().toISOString();
        // var Today = Datenow.slice(0,10);
        // var Time = Datenow.slice(11,19);
        // const chk_checkout = await Timesheet.find({$and:[{workDate: Today, name: req.user.name,checkout: null,userId: req.user.user_id}]});
        // // console.log(chk_checkout);

        // if(chk_checkout.length > 0) {
        //     console.log("ยังไม่ได้ลงชื่อออกงาน")
        //     const resultCheckout = await Timesheet.findAndModify({query:{userId: req.user.user_id},update: {$inc:{checkout: Time}}});
        //     console.log(resultCheckout);
        //     return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ", data: resultCheckout});
        // }else{
        //     console.log("ออกงานแล้ว");
        //     return res.status(200).send({message: "คุณลงชื่อออกงานแล้ว"});
        // }
        //  /* -----------------------------------------------------*/

        
        
        
    }catch(error){
        console.log(error)
        res.status(500).send({message: "Internal Server Error"});
    }
};