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
        const getToday = await Timesheet.find({workDate: Today, userId: req.user.user_id});
        
        var Datenow2 = new Date().toISOString();
        var Today = Datenow2.slice(0,10);
        var Time = Datenow2.slice(11,19);

        console.log(Datenow2);
        console.log(Today)
       
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
          const DateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' },
          {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: "2-digit"});
          const getHours = new Date(DateTime).getHours();
          const getMin  = new Date(DateTime).getMinutes();
          const getSecond = new Date(DateTime).getSeconds();
          var getDay = new Date(DateTime).getDate();
          var getMonth = new Date(DateTime).getMonth()+1;
          var getYear = new Date(DateTime).getFullYear();
          var convert_getHours = getHours < 10 ? '0'+getHours : getHours;
          var convert_getMin = getMin < 10 ? '0'+getMin : getMin;
          var convert_getSecond = getSecond < 10 ? '0'+getSecond : getSecond;
          var convert_getDay = getDay < 10 ? '0'+getDay : getDay;
          var convert_getMonth = getMonth < 10 ? '0'+getMonth : getMonth;

          const FullTime =(convert_getHours+":"+convert_getMin+":"+convert_getSecond);
          const FullDate = (getYear+"-"+convert_getMonth+"-"+convert_getDay);
          
          console.log("FullTime :", FullTime);
          console.log("FullDate :", FullDate);
        const getUserId = await User.findOne({name: req.user.name}).select("_id");

        const chk_checkin = await Timesheet.find({$and:[{workDate: FullDate, name: req.user.name, userId: req.user.user_id}]});
          console.log("chk_checkin>>>>>>", chk_checkin)
        if(chk_checkin.length > 0){
            return res.status(200).send({message: "คุณลงเวลาทำงานแล้ว"});
        }else{
            let CheckinTime = {
                name: req.user.name,
                workDate : FullDate,
                checkin : FullTime,
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
        // var Datenow = new Date().toISOString('en-US', { timeZone: 'Asia/Jakarta' });
        // var Today = Datenow.slice(0,10);
        // var Time = Datenow.slice(11,19);
          /* -------------------------------------- */
          const DateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' },
          {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: "2-digit"});
          const getHours = new Date(DateTime).getHours();
          const getMin  = new Date(DateTime).getMinutes();
          const getSecond = new Date(DateTime).getSeconds();
          var getDay = new Date(DateTime).getDate();
          var getMonth = new Date(DateTime).getMonth()+1;
          var getYear = new Date(DateTime).getFullYear();
          var convert_getHours = getHours < 10 ? '0'+getHours : getHours;
          var convert_getMin = getMin < 10 ? '0'+getMin : getMin;
          var convert_getSecond = getSecond < 10 ? '0'+getSecond : getSecond;
          var convert_getDay = getDay < 10 ? '0'+getDay : getDay;
          var convert_getMonth = getMonth < 10 ? '0'+getMonth : getMonth;

          const FullTime =(convert_getHours+":"+convert_getMin+":"+convert_getSecond);
          const FullDate = (getYear+"-"+convert_getMonth+"-"+convert_getDay);
          console.log("FullData: ", FullDate, "FullTime :", FullTime);

          const chk_checkout = await Timesheet.find({$and:[{workDate: FullDate, name: req.user.name,checkout: "-",userId: req.user.user_id}]});
          console.log("chk_checkout >>>>> ", FullDate)
          console.log("req.user.name", req.user.name);
          console.log(chk_checkout);
        if(chk_checkout.length > 0){

            const checkout_query = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{checkout: FullTime}})
            const getTimesheet = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]});
            const workingStartToday = (getTimesheet[0]['checkin']).split(':');
            const workingEndToday = (getTimesheet[0]['checkout']).split(':');
            const workingStartCaltoSec = (+workingStartToday[0]) * 60 * 60 + (+workingStartToday[1]) * 60 + (+workingStartToday[2]);
            const workingEndCaltoSec = (+workingEndToday[0]) * 60 * 60 + (+workingEndToday[1]) * 60 + (+workingEndToday[2]);
            const MinusForSec = workingEndCaltoSec - workingStartCaltoSec ;
            const chkCalDate = ((MinusForSec/60)/60).toFixed(2);
            const TotalTime = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{total: chkCalDate}})
            const reChk_checkout = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id, name: req.user.name}]});
            
            console.log("reChk_checkout", reChk_checkout[0]['checkout']);
            console.log("workingStartCaltoSec", workingStartCaltoSec)
            console.log("workingEndCaltoSec", workingEndCaltoSec);

            const chkOT = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id, name: req.user.name}]});
            if(chkOT[0]['checkout'] > "18:29:59"){
                    const start_ot = ("18:29:59").split(':');
                    const time_ot = (chkOT[0]['checkout']).split(':');
                    const ot_sec = (+time_ot[0]) * 60 * 60 + (+time_ot[1]) * 60 + (+time_ot[2]);
                    const start_ot_sec = (+start_ot[0]) * 60 * 60 + (+start_ot[1]) * 60 + (+start_ot[2]);
                    const caltoOT = (ot_sec - start_ot_sec) ;
                    const result_ot = ((caltoOT/60)/60).toFixed(2);
                    const calToMillianSec = (caltoOT*1000)
                    const newDateOT = new Date(calToMillianSec);
                    const timeOT = newDateOT.getHours()+":"+newDateOT.getMinutes();
                    // const TotalOT = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{ot: result_ot}})
                    const chkCalOT = "20:30:00" - "18:30:00";
                    console.log("Time OT : ", start_ot_sec);



                    
                    /*--------------------------*/
            }else{
                    console.log("ยังไม่ถึงเวลา OT")
            }
            console.log(chkOT[0]['checkout']);
            return res.status(200).send({message: "ลงเวลาออกงานสำเร็จ"});
        }else{
            return res.status(500).send({message: "คุณได้ลงเวลาออกงานไปแล้ว"});
        }
        
        // if(chk_checkout.length > 0) {
        //     console.log("ยังไม่ได้ลงชื่อออกงาน")
        //     // console.log(chk_checkout);
        //     const checkout_query = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{checkout: FullTime}})
        //     const cktime_checkin = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkin');
        //     const startWorking = cktime_checkin[0]['checkin'];
        //     const cktime_checkout = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkout');
        //     const splitCheckin = startWorking.split(':');
        //     const splitCheckout = (cktime_checkout[0]['checkout']).split(':');
        //     const checkin = (+splitCheckin[0]) * 60 * 60 + (+splitCheckin[1]) * 60 + (+splitCheckin[2]);
        //     const checkout = (+splitCheckout[0]) * 60 * 60 + (+splitCheckout[1]) * 60 + (+splitCheckout[2]);
        //     const calTotalTime = checkout - checkin;
        //     const TotalTime = (calTotalTime/60)/60;
        //     console.log("Data >>>> ",cktime_checkout);
            
        //     var decimalTimeString = TotalTime;
        //         var decimalTime = parseFloat(decimalTimeString);
        //         decimalTime = decimalTime * 60 * 60;
        //         var hours = Math.floor((decimalTime / (60 * 60)));
        //         decimalTime = decimalTime - (hours * 60 * 60);
        //         var minutes = Math.floor((decimalTime / 60));
        //         decimalTime = decimalTime - (minutes * 60);
        //         var seconds = Math.round(decimalTime);
        //         if(hours < 10)
        //         {
        //             hours = "0"+hours;
        //         }
        //         if(minutes < 10)
        //         {
        //             minutes = "0"+minutes;
        //         }
        //         if(seconds < 10)
        //         {
        //             seconds = "0"+seconds;
        //         }
        //        const convertTotal = hours+":"+minutes+":"+seconds ;

        //        console.log("convertTotal", convertTotal);

        //     const getTimeCheckout  = await Timesheet.find({name: req.user.name, workDate: FullDate}).select('checkout');
        //     const TimeCheckoutOT = getTimeCheckout[0]['checkout'];

        //     if(TimeCheckoutOT > "18:29:59"){
        //         const cktime_checkout_OT = await Timesheet.find({$and:[{workDate: FullDate,userId: req.user.user_id}]}).select('checkout');
        //         const splitCheckin_OT = startWorking.split(':');
        //         const splitCheckout_OT = (cktime_checkout_OT[0]['checkout']).split(':');
        //         const checkout_OT = (+splitCheckin_OT[0]) * 60 * 60 + (+splitCheckin_OT[1]) * 60 + (+splitCheckin_OT[2]);

        //         const totalOT =  checkout_OT - "18.30";
        //         console.log(totalOT);
        //     }
        //     const updateOT = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{ot: totalOT}})
        //     const updateTotal = await Timesheet.updateOne({name: req.user.name, workDate: FullDate}, {$set:{total: convertTotal}})
            
        //     return res.status(200).send({message:"ลงชื่อออกงานสำเร็จ"});
        // }else{
        //     console.log("ออกงานแล้ว");
        //     console.log("Today : ",Today);
        //     console.log("Fulldate : ",FullDate);
        //     console.log("Fulltime : ",FullTime);
            
            // return res.status(200).send({message: "คุณลงชื่อออกงานไปแล้ว"});
        // }

    }catch(error){
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});
    }
};

module.exports.FilterTimsheet = async (req, res) => {
        try{
            const permission = ["owner", "admin", "manager", "employee"];
  
            if (!permission.includes(req.user.level)) {
              return res.status(403).send({message: "Permission denied"});
            }

            const DateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' },
            {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: "2-digit"});
            const getHours = new Date(DateTime).getHours();
            const getMin  = new Date(DateTime).getMinutes();
            const getSecond = new Date(DateTime).getSeconds();
            var getDay = new Date(DateTime).getDate();
            var getMonth = new Date(DateTime).getMonth()+1;
            var getYear = new Date(DateTime).getFullYear();
            var convert_getHours = getHours < 10 ? '0'+getHours : getHours;
            var convert_getMin = getMin < 10 ? '0'+getMin : getMin;
            var convert_getSecond = getSecond < 10 ? '0'+getSecond : getSecond;
            var convert_getDay = getDay < 10 ? '0'+getDay : getDay;
            var convert_getMonth = getMonth < 10 ? '0'+getMonth : getMonth;
            const FullTime =(convert_getHours+":"+convert_getMin+":"+convert_getSecond);
            const FullDate = (getYear+"-"+convert_getMonth+"-"+convert_getDay);
            const getUserTimesheet = await Timesheet.find({workDate: req.body.Date});
            
            return  res.status(200).send({message: "Get Timesheet from date Success", getUserTimesheet});;
        }catch(error){
            res.status(500).send({message: "Internal Server Error"});
        }
}
