var jwt = require("jsonwebtoken");
var Checkout = require("../models/checkout.model");
var Checkin = require("../models/checkin.model");


module.exports.Getcheckout = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager", "employee"];
          if (!permission.includes(req.user.level)) {
        return res.status(403).send({message: "Permission denied"});
      }
      // console.log("req.user >>>>>> ",req.user);
      var start = new Date();
      start.setHours(0,0,0,0);
      var end = new Date();
      end.setHours(23,59,59,999);
      var OT = new Date();
      OT.setHours(17,59,59,999);
      console.log(OT.getHours());
      const chkNameData_checkout = await Checkout.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind7"}]});
      const chkNameData_checkin  = await Checkin.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind7"}]});
     console.log("CHK NAME : ",chkNameData_checkout[0]['timeChackin'].toString());

      if(chkNameData_checkout.length == 0 || chkNameData_checkin.length == 0){
        const checkout = await Checkout.find();
        const result_data = [];
        result_data.push(checkout);

        console.log('No have')
        console.log(result_data);

          return res.status(200).send({message: "Get check out data Success", data: checkout});
      }else{
        console.log("have data");
      /* Check Data Checkout time */
        const CheckoutTime = await Checkout.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind7"}]}).select('timeChackin');
        const CheckoutFullTime = (CheckoutTime[0]['timeChackin']).toString();
        const GetfulltimeCheckout = CheckoutFullTime.slice(16,24);
        const checkOutactualTime = GetfulltimeCheckout.split(':');
        const checkoutSeconds =  (+checkOutactualTime[0]) * 60 * 60 + (+checkOutactualTime[1]) * 60 + (+checkOutactualTime[2]);


        /* Check Data Checin time */
  
        const CheckinTime = await Checkin.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind7"}]}).select('timeChackin');
        const CheckinFullTime = (CheckinTime[0]['timeChackin']).toString();
        const GetfulltimeCheckin = CheckinFullTime.slice(16,24);
        const checkIntactualTime = GetfulltimeCheckin.split(':');
        const checkinSeconds = (+checkIntactualTime[0]) * 60 * 60 + (+checkIntactualTime[1]) * 60 + (+checkIntactualTime[2]);
        const workingTime = (((checkoutSeconds-checkinSeconds)/60)/60);
        const workingTimeStr = workingTime.toString();
        const chk_mod = (checkoutSeconds-checkinSeconds);
      //   console.log(" ปัดขึ้น ",Math.ceil(1.3499999999999972));   --->> ปัดเศษขึ้น
        console.log("Mod Data : ", chk_mod);

        /*-------------------------*/
        console.log("Checkout Full Time >>", CheckoutFullTime)
        const checkout = await Checkout.find();
        const result_data = [];
        result_data.push(checkout);
      
        return res.status(200).send({message: "Get check out data Success", data: result_data});
      }
      
     
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
          /* Check Data Total time */
        
          const CheckoutTime = await Checkout.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind7"}]}).select('timeChackin');
       
        const fulltime = (CheckoutTime[0]['timeChackin']).toString();
        const Getfulltime = fulltime.slice(16,24);
        var actualTime = Getfulltime.split(':');
        var totalSeconds =  (+actualTime[0]) * 60 * 60 + (+actualTime[1]) * 60 + (+actualTime[2]);
        console.log(">>>>>>>>>>",Getfulltime);
        console.log("This Total seconds > > > >",totalSeconds);
          /*-------------------------*/

          const chk_checkout = await Checkout.find({timeChackout: {$gte: start, $lt: end},name: req.user.name});
          console.log(req.user.name);
          if(chk_checkout.length>0){
            return res.status(404).send({message : "คุณลงเวลาออกงานไปแล้ว"});
         }else{
          console.log("ลงเวลาออกงานสำเร็จ");
          let checkoutData = {
            name: "Undermind9",
            status: req.body.status == 1 ? "ยังไม่เข้างาน" : "เข้างาน",
            timeChackin: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // userId: req.body.userId,  <<<<<<<<< insert User ID //
        };
 
        const tcheckin = new Checkout(checkoutData);
        const new_tcheckout = await tcheckin.save();
        return res.status(200).send({message: "ลงเวลาออกงานสำเร็จ", data: {new_tcheckout}});
         }
        
    }catch(error){
        return res.status(500).send({message: "Internal Server Error"});
    }
  };