// var _this = this;
var jwt = require("jsonwebtoken");
var Checkin = require("../models/checkin.model");
// var bcrypt = require("bcrypt");
module.exports.Getcheckin = async (req, res) => {
  
    try {
      const permission = ["owner", "admin", "manager", "employee"];
  
      if (!permission.includes(req.user.level)) {
        return res.status(403).send({message: "Permission denied"});
      }
  
      const checkin = await Checkin.find();
      this.mockup_data = checkin;
      return res.status(200).send({message: "Get user successfully", data: checkin});
    } catch (error) {
      console.error(error);
      return res.status(500).send({message: "Internal Server Error"});
    }
  };

module.exports.Create = async (req, res) => {
    try {
        const permission = ["owner", "admin", "manager"];

        if (!permission.includes(req.user.level)) {
            return res.status(403).send({message: "Permission denied"});
          }
          
/** -----------------------------------Test DATA------------------------------------------------ **/
          const now = new Date()
          // const currentUser = await User.findById(req.user.user_id);
          // const Today = Date.now();
          // const Today2 = currentDate.getTime();
          // var chkdate = new Date();
          // var chk_month = chkdate.getMonth();
          // var chk_aa = await Checkin.find({name: req.user.name, }).select('createdAt').limit(1);
          // const chk_chk = await Checkin.find({name: req.user.name}).limit(1);
          // const chk_day = chkdate.getDay(chk_aa);
          // const data_slice = now.getDate();
          // console.log("This is UserID >>>",req.user.name);
          // console.log("This ID >>>",req.user.iat);
          // const data_time = req.user.iat;
          // console.log("Name :",Checkin.timeChackin);
          // const day = Date.now();
          // console.log(req.body.name);
          // console.log("This new Date >>>>", data_slice);
          // console.log("chk Year >>>>", now.getFullYear())
          // console.log("chk Month >>>>", now.getMonth()+1)
          // console.log("Full Datetime >>>>", data_slice, "-", now.getMonth()+1,"-", now.getFullYear())
/** ------------------------------------------------------------------------------------------------------------ **/
         const datetime = new Date;
         var month = datetime.getMonth();
         const month2 = month+1;
         const FullDateTime = datetime.getFullYear()+"-"+month2+"-"+datetime.getDate()+"T";
         const chkdatetoday = await Checkin.find({createAt:{$regex: /^FullDateTime/}});
         const dayyyyy = datetime.getDay();
         const thisday = ["Sunday","Monday","Tuesday","Wednesday","Thuesday","Friday","Saturday"];
         console.log("This Full datetime last >>>>>> ", thisday[dayyyyy]);
        //  console.log("This checked >>>> ", FullDateTime);
         console.log("Chk date >>>", datetime.toDateString());

         var start = new Date();
         start.setHours(0,0,0,0);
         var end = new Date();
         end.setHours(23,59,59,999);
         const chk_checkin = await Checkin.find({userId:req.body.userId,timeChackin: {$gte: start, $lt: end},name: req.user.name});
         console.log("This REQ USER NAME >>>> ",req.user.name);
         if(chk_checkin.length>0){
            return res.status(404).send({message : "คุณลงเวลาทำงานไปแล้ว"});
         }else{
          // return res.status().send({messsage: "Your logined"});
          console.log("Your logined");
          let checkinData = {
            name: req.body.name,
            status: req.body.status == 1 ? "เข้างาน" : "ยังไม่เข้างาน",
            timeChackin: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            userId: req.body.userId, // <<<<<<<<< insert User ID //
        };
        // console.log(checkinData)
 
        const tcheckin = new Checkin(checkinData);
        const new_tcheckin = await tcheckin.save();
        return res.status(200).send({message: "ลงเวลาทำงานสำเร็จ", data: {new_tcheckin}});
         }

        //  console.log(chk_chk);
        // save checkin
        
        // let checkinData = {
        //     name: req.body.name,
        //     status: req.body.status == 1 ? "เข้างาน" : "ยังไม่เข้างาน",
        //     timeChackin: Date.now(),
        //     createdAt: Date.now(),
        //     updatedAt: Date.now(),
        //     userId: req.body.userId, // <<<<<<<<< insert User ID //
        // };
        // // console.log(checkinData)
 
        // const tcheckin = new Checkin(checkinData);
        // const new_tcheckin = await tcheckin.save();

        // return res.status(200).send({message: "Checkin saved successfully", data: {new_tcheckin}})
    }catch (error){
        console.error(error);
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
};


// Update Data Checkin //
module.exports.Update = async (req, res) => {
  try{
    const permission = ["owner", "admin", "manager"];

    if (!permission.includes(req.user.level)) {
        return res.status(403).send({message: "Permission denied"});
      }
      const checkin = await Checkin.findById();
      if (!checkin) {
        return res.status(400).send({message: "User not found"});
      }
      
      const updateData = {
        name: req.body.name ? req.body.name : user.name,
        status: req.body.status ? req.body.status : checkin.status,
        timeChackin: req.body.timeChackin ? "-" : " ",
        createAt: req.body.createAt ? req.body.createAt : " ",
        updateAt: req.body.updateAt ? req.body.updateAt: checkin.update
      };



      const result = await Checkin.findByIdAndUpdate(checkin._id, updateData, {
        returnDocument: "after",
      });

      return res.status(200).send({message: "Updated successfully", data: result});
  }catch(error){
    console.log.error(error);
    return res
    .status(500)
    .send({message: "Internal server error", error: error.message})
  }
};

// Delete Checkin Data
module.exports.Delete = async (req, res) => {
  try {
    const permission = ["owner", "admin", "manager"];

    if (!permission.includes(req.user.level)) {
      return res.status(403).send({message: "Permission denied"});
    }

    const result = await Checkin.deleteOne(req.params.id);
    return res.status(200).send(result);
    }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message})
    }
};






// var test =  req.body.name != "" ? req.body.name : "Not";

// if(req.body.name != ""){
//   test = req.body.name
// }else{
//   test = "Not"
// }