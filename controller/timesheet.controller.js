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
        var date = new Date();
        // date.setHours(Datenow.getHours() + 5);
        var Datenow = new Date().toISOString();
        var Today = Datenow.slice(0,10);
        var Time = Datenow.slice(11,19);
        const cktime_checkin = await Timesheet.find({$and:[{workDate: Today,userId: req.user.user_id}]}).select('checkin');
        const starWorking = cktime_checkin[0]['checkin'];
        const cktime_checkout = await Timesheet.find({$and:[{workDate: Today,userId: req.user.user_id}]}).select('checkout');
        const splitCheckin = starWorking.split(':');
        const splitCheckout = (cktime_checkout[0]['checkout']).split(':');
        const checkin = (+splitCheckin[0]) * 60 * 60 + (+splitCheckin[1]) * 60 + (+splitCheckin[2]);
        const checkout = (+splitCheckout[0]) * 60 * 60 + (+splitCheckout[1]) * 60 + (+splitCheckout[2]);
        const calTotalTime = checkout - checkin;
        const TotalTime = (calTotalTime/60)/60;
        // var DateTimeZone = Datenow.addHours(7);
        // const getToday = await Timesheet.find({$and:[{workDate: Today,userId: req.user.user_id}]});

        const getToday = await Timesheet.find({workDate: Today});

        const getCheckinTime = await Timesheet.find({workDate: Today, userId: req.user.name});
        // console.log(checkin);
        console.log("Time =",TotalTime);
        
        
         /* -----------------------------------------------------*/

        
        
         return res.status(200).send({message: "Get Data Success", data: getDataTimesheet, getToday});
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
                checkout : "-",
                total : "-",
                ot : "-",
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
        var Datenow = new Date().toISOString();
        var Today = Datenow.slice(0,10);
        var Time = Datenow.slice(11,19);
        const chk_checkout = await Timesheet.find({$and:[{workDate: Today, name: req.user.name,checkout: "-",userId: req.user.user_id}]});

        if(chk_checkout.length > 0) {
            console.log("ยังไม่ได้ลงชื่อออกงาน")
            console.log(chk_checkout);
            const checkout = await Timesheet.updateOne(
                { name : req.user.name },
                { $set: { checkout : Time } }
             );
            console.log(checkout);
            return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ"});
        }else{
            console.log("ออกงานแล้ว");
            return res.status(200).send({message: "คุณลงชื่อออกงานแล้ว"});
        }
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});
    }
}