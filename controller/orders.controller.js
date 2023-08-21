module.exports.GetOrders = async (req,res) => {
    const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${process.env.SHOP_API_URL}/orderservice/list`,
  headers: { 
    'auth-token': process.env.SHOP_API_KEY
  }
};

await axios.request(config)
.then((response) => {
  return res.status(200).send(response.data);
})
.catch((error) => {
  return res.status(500).send(error.message);
});
}

//get order by id
module.exports.GetOrdersById = async (req,res) => {
  const axios = require('axios');

let config = {
method: 'get',
maxBodyLength: Infinity,
url: `${process.env.SHOP_API_URL}/orderservice/list/${req.params.id}`,
headers: { 
  'auth-token': process.env.SHOP_API_KEY
}
};

await axios.request(config)
.then((response) => {
return res.status(200).send(response.data);
})
.catch((error) => {
return res.status(500).send(error.message);
});
}

//send order feedback
module.exports.OrderFeedback = async (req,res) => {

  const permission = ['employee'];

  if(!permission.includes(req.user.level)){
      return res.status(403).send({message:'Permission denied'});
  }

  const requestData = {
      status: req.body.status,
      _id: req.user.user_id,
      name: req.user.name,
  }
  console.log(requestData);

  const axios = require('axios');

  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${process.env.SHOP_API_URL}/orderservice/accept/${req.params.id}`,
    headers: { 
      'auth-token': process.env.SHOP_API_KEY,
      'content-type': 'application/json'
    },
    data:requestData
  };
  
  await axios.request(config)
  .then((response) => {
    return res.status(200).send(response.data);
  })
  .catch((error) => {
    return res.status(500).send(error.message);
  });

}