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
        var Datenow = new Date().toISOString('en-US', { timeZone: 'Asia/Jakarta' });
        var Today = Datenow.slice(0,10);
        var Time = Datenow.slice(11,19);
        const getDataTimesheet = await Timesheet.find();
        const getToday = await Timesheet({workDate: Today});
        

       
         return res.status(200).send({message: "Get Data Success", data: getDataTimesheet,getToday});
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
        var Datenow = new Date().toISOString('en-US', { timeZone: 'Asia/Jakarta' });
        var Today = Datenow.slice(0,10);
        var Time = Datenow.slice(11,19);

          /* -------------------------------------- */
          const DateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' },
          {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: "2-digit"}); 
          const getHours = new Date(DateTime).getHours();
          const getMin  = new Date(DateTime).getMinutes();
          const getSecond = new Date(DateTime).getSeconds();
          var getDay = new Date(DateTime).getDay()-2;
          var getMonth = new Date(DateTime).getMonth()+1;
          var getYear = new Date(DateTime).getFullYear();
          if(getDay < 10){
            getDay = '0'+getDay;
          }
          if(getMonth<10){
            getMonth = '0'+getMonth;
          }
          if(getHours<10){
            getHours = '0'+getHours;
          }
          if(getMin<10){
            getMin = '0'+getMin
          }

          const FullTime =(getHours+":"+getMin+":"+getSecond);
          const FullDate = (getYear+"-"+getMonth+"-"+getDay);
          console.log(FullTime,"------------", getHours+":"+getMin+":"+getSecond);
          /*--------------------------------------- */

        const chk_checkout = await Timesheet.find({$and:[{workDate: FullDate, name: req.user.name,checkout: "-",userId: req.user.user_id}]});
        console.log(chk_checkout);
        console.log("FullDate : >>>>>  ", FullDate)
        if(chk_checkout.length > 0) {
            console.log("ยังไม่ได้ลงชื่อออกงาน")
            // console.log(chk_checkout);
            const checkout_query = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{checkout: FullTime}})
            const cktime_checkin = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkin');
            const startWorking = cktime_checkin[0]['checkin'];
            const cktime_checkout = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkout');
            const splitCheckin = startWorking.split(':');
            const splitCheckout = (cktime_checkout[0]['checkout']).split(':');
            const checkin = (+splitCheckin[0]) * 60 * 60 + (+splitCheckin[1]) * 60 + (+splitCheckin[2]);
            const checkout = (+splitCheckout[0]) * 60 * 60 + (+splitCheckout[1]) * 60 + (+splitCheckout[2]);
            const calTotalTime = checkout - checkin;
            const TotalTime = (calTotalTime/60)/60;
            console.log("Data >>>> ",cktime_checkout);
            
            var decimalTimeString = TotalTime;
                var decimalTime = parseFloat(decimalTimeString);
                decimalTime = decimalTime * 60 * 60;
                var hours = Math.floor((decimalTime / (60 * 60)));
                decimalTime = decimalTime - (hours * 60 * 60);
                var minutes = Math.floor((decimalTime / 60));
                decimalTime = decimalTime - (minutes * 60);
                var seconds = Math.round(decimalTime);
                if(hours < 10)
                {
                    hours = "0"+hours;
                }
                if(minutes < 10)
                {
                    minutes = "0"+minutes;
                }
                if(seconds < 10)
                {
                    seconds = "0"+seconds;
                }
               const convertTotal = hours+":"+minutes+":"+seconds ;

               console.log("convertTotal", convertTotal);

            const getTimeCheckout  = await Timesheet.find({name: req.user.name, workDate: FullDate}).select('checkout');
            const TimeCheckoutOT = getTimeCheckout[0]['checkout'];

            // if(TimeCheckoutOT > "18:29:59"){
            //     const cktime_checkout_OT = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkout');
            //     const splitCheckin_OT = startWorking.split(':');
            //     const splitCheckout_OT = (cktime_checkout_OT[0]['checkout']).split(':');
            //     const checkout_OT = (+splitCheckin_OT[0]) * 60 * 60 + (+splitCheckin_OT[1]) * 60 + (+splitCheckin_OT[2]);

            //     const totalOT =  checkout_OT - "18.30";
            //     console.log(totalOT);
            // }
            // const updateOT = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{ot: totalOT}})
            // const updateTotal = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{total: convertTotal}})

            console.log
            
            return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ"});
        }else{
            console.log("ออกงานแล้ว");
            console.log("Today : ",Today);
            console.log("Fulldate : ",FullDate);
            console.log("Fulltime : ",FullTime);
            
            return res.status(200).send({message: "คุณลงชื่อออกงานไปแล้ว"});
        }
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});
    }
}

