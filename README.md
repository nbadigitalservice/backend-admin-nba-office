# backend-admin-nba-office
 Official nba admin api
# 

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
