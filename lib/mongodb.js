const mongoose = require('mongoose');

async function connectDatabase() {
    mongoose.set('strictQuery',true);
    try {
        await mongoose.connect(process.env.ATLAS_MONGODB,{useNewUrlParser:true}).then((result)=>{
        if(result){
           console.log('connected'); 
        }
        else{
            console.log('database error');
        }
    });
    
    } catch (error) {
        console.log(error);
    }
    
  }

 module.exports = connectDatabase;