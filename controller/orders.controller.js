module.exports.GetOrders = async (req,res) => {
    const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://192.168.1.202:9030/v1/nba-shop/orderservice/list',
  headers: { 
    'auth-token': process.env.SHOP_API_KEY
  }
};

axios.request(config)
.then((response) => {
  return res.status(200).send(response.data);
})
.catch((error) => {
  return res.status(500).send(error.message);
});
}