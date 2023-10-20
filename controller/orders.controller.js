const {model} = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

module.exports.GetOrders = async (req, res) => {
  const axios = require("axios");

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.SHOP_API_URL}/orderservice/list`,
    headers: {
      "auth-token": process.env.SHOP_API_KEY,
    },
  };

  await axios
    .request(config)
    .then((response) => {
      return res.status(200).send(response.data);
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
};

//get order by id
module.exports.GetOrdersById = async (req, res) => {
  const axios = require("axios");

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.SHOP_API_URL}/orderservice/list/${req.params.id}`,
    headers: {
      "auth-token": process.env.SHOP_API_KEY,
    },
  };

  await axios
    .request(config)
    .then((response) => {
      return res.status(200).send(response.data);
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
};

module.exports.acceptOrder = async (req, res) => {
  const axios = require("axios");
  const permission = ["employee"];

  if (!permission.includes(req.user.level)) {
    return res.status(403).send({message: "Permission denied"});
  }

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${process.env.SHOP_API_URL}/orderservice/accept/${req.params.id}`,
    headers: {
      "auth-token": process.env.SHOP_API_KEY,
      "content-type": "application/json",
    },
  };

  await axios
    .request(config)
    .then((response) => {
      console.log(response)
      return res.status(200).send(response.data);
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
};

//send order feedback
module.exports.OrderFeedback = async (req, res) => {
  const permission = ["employee"];

  if (!permission.includes(req.user.level)) {
    return res.status(403).send({message: "Permission denied"});
  }

  const requestData = [];
  requestData.push({
    name: req.body.status,
    employee: req.user.name,
    timestamp: dayjs(Date.now()).format(""),
  });
  console.log(requestData);

  const axios = require("axios");

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${process.env.SHOP_API_URL}/orderservice/accept/${req.params.id}`,
    headers: {
      "auth-token": process.env.SHOP_API_KEY,
      "content-type": "application/json",
    },
    data: requestData,
  };

  await axios
    .request(config)
    .then((response) => {
      return res.status(200).send(response.data);
    })
    .catch((error) => {
      return res.status(500).send(error.message);
    });
};

module.exports.DoneOrder = async (req, res) => {
  let upload = multer({storage: storage}).array("imgCollection", 20);

  upload(req, res, async function (err) {
    if (err) {
      console.error(err);
      return res.status(400).send("upload error", err);
    }
    const axios = require("axios");
    const FormData = require("form-data");
    const fs = require("fs");
    let data = new FormData();
    const files = req.files;

    for (const file of files) {
      data.append("imgCollection", fs.createReadStream(file.path));
    }

    data.append("detail", req.body.detail);
    data.append("transport", req.body.transport);
    data.append("trackingNo", req.body.trackingNo);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.SHOP_API_URL}/orderservice/deliver/${req.params.id}`,
      headers: {
        "auth-token": process.env.SHOP_API_KEY,
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return res
          .status(200)
          .send({message: "upload success", data: response.data});
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send({message: "service error", data: error});
      });
  });
};
