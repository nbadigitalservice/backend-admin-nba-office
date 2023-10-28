var jwt = require("jsonwebtoken");
var Checkout = require("../models/checkout.model");

module.exports.Getchekout = async (req, res) => {
    try{
        const permission = ["owner", "admin", "manager", "employee"];
        if (!permission.includes(req.user.level)) {
            return res.status(403).send({message: "Permission denied"});
        }
        const checkout = await Checkout.find();

        return res.status(200).send({message: "Get Checkout successfully", data: checkout});
    }catch(error){

    }
};