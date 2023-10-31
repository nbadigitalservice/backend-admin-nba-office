var jwt = require("jsonwebtoken");
var Checkout = require("../models/checkout.model");
var Checkin = require("../models/checkin.model");


module.exports.Getcheckout = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager", "employee"];
          if (!permission.includes(req.user.level)) {
        return res.status(403).send({message: "Permission denied"});
      }
      var start = new Date();
      start.setHours(0,0,0,0);
      var end = new Date();
      end.setHours(23,59,59,999);
      /* Check Data Checkout time */
      const CheckoutTime = await Checkout.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind6"}]}).select('timeChackin');
      const CheckoutFullTime = (CheckoutTime[0]['timeChackin']).toString();
      const GetfulltimeCheckout = CheckoutFullTime.slice(16,24);
      const checkOutactualTime = GetfulltimeCheckout.split(':');
      const checkoutSeconds =  (+checkOutactualTime[0]) * 60 * 60 + (+checkOutactualTime[1]) * 60 + (+checkOutactualTime[2]);
      /* Check Data Checin time */

      const CheckinTime = await Checkin.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind6"}]}).select('timeChackin');
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
        const checkout = await Checkout.find();


        var arr_data = new Array();
            arr_data[0] = (checkout);
            arr_data[1] = (workingTime);
            // arr_data[1] = workingTime;
        console.log("Arr Data 1 >>>>> ",checkoutSeconds);
      
        return res.status(200).send({message: "Check Success", data: arr_data[1]});
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
          const CheckoutTime = await Checkout.find({$and:[{timeChackin: {$gte: start, $lt: end},name: "Undermind"}]}).select('timeChackin');
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
            name: req.user.name,
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