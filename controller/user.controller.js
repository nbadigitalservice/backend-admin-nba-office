var jwt = require("jsonwebtoken");
var {
  User,
  validateUser,
  validateLogin,
  validateUpdate,
} = require("../models/user.model");
var bcrypt = require("bcrypt");

var {uploadFileCreate, deleteFile} = require("./../lib/uploadservice");

const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

//get me
module.exports.Me = async (req, res) => {
  try {
    const token = req.headers["token"];
    if (!token) {
      return res.status(403).send({message: "Invalid User"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(400).send({message: "Permission denied"});
      }
      const projection = {
        name: 1,
        surname: 1,
        username: 1,
        level: 1,
        department: 1,
        email: 1,
        tel: 1,
        about_me: 1,
        line: 1,
        avatar: 1,
        about_me: 1,
      };
      const user = await User.findById(decoded.user_id, projection);

      return res.status(200).send({message: "Permission granted", data: user});
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal Server Error", error: error.message});
  }
};

//login
module.exports.Login = async (req, res) => {
  try {
    const {error} = validateLogin(req.body);
    if (error) {
      return res.status(403).send({
        message: "Data validation failed",
        error: error.details[0].message,
      });
    }
    console.log(req.body.username)
    const user = await User.findOne({username: req.body.username});

    if (!user) {
      return res.status(403).send({message: "User not found"});
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(403).send({message: "Invalid password"});
    }

    const payload = {
      user_id: user._id,
      name: user.name,
      level: user.level,
      department: user.department,
      avatar: user.avatar,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "4H",
    });

    return res.status(200).send({message: "login successful", token: token});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal Server Error", error: error.message});
  }
};

//register
module.exports.Create = async (req, res) => {
  try {
    const permission = ["owner", "admin", "manager"];

    if (!permission.includes(req.user.level)) {
      return res.status(403).send({message: "Permission denied"});
    }

    const {error} = validateUser(req.body);

    if (error) {
      return res.status(403).send({
        message: "Data validation failed",
        error: error.details[0].message,
      });
    }

    //save user
    const password = await bcrypt.hash(req.body.password, 10);
    let userData = {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      password: password,
      level: req.body.level,
      department: req.body.department,
      email: req.body.email,
      tel: req.body.tel,
    };

    console.log(userData);

    const user = new User(userData);
    const newuser = await user.save();

    return res
      .status(200)
      .send({message: "User saved successfully", data: newuser});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal server error", error: error.message});
  }
};

//update
module.exports.Update = async (req, res) => {
  try {
    const {error} = validateUpdate(req.body);

    if (error) {
      return res.status(403).send({
        message: "Data validation failed",
        error: error.details[0].message,
      });
    }

    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(400).send({message: "User not found"});
    }

    if (req.user.user_id != user._id) {
      return res.status(403).send({message: "Permission denied"});
    }

    var password;

    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, 10);
    }

    const updateData = {
      name: req.body.name ? req.body.name : user.name,
      surname: req.body.sername ? req.body.sername : user.surname,
      password: req.body.password ? password : user.password,
      email: req.body.email ? req.body.email : user.email,
      tel: req.body.tel ? req.body.tel : user.tel,
      about_me: req.body.about_me ? req.body.about_me : user.about_me,
      line: req.body.line ? req.body.line : user.line,
    };

    const result = await User.findByIdAndUpdate(user._id, updateData, {
      returnDocument: "after",
    });

    return res
      .status(200)
      .send({message: "updated successfully", data: result});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal server error", error: error.message});
  }
};

//delete
module.exports.Delete = async (req, res) => {
  try {
    const permission = ["owner", "admin", "manager"];

    if (!permission.includes(req.user.level)) {
      return res.status(403).send({message: "Permission denied"});
    }

    const result = await User.deleteOne({_id: req.params.id});

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({message: "Internal server error", error: error.message});
  }
};

//get user
module.exports.GetUser = async (req, res) => {
  try {
    const permission = ["owner", "admin", "manager", "employee"];

    if (!permission.includes(req.user.level)) {
      return res.status(403).send({message: "Permission denied"});
    }

    const user = await User.find();
    return res.status(200).send({message: "Get user successfully", data: user});
  } catch (error) {
    console.error(error);
    return res.status(500).send({message: "Internal Server Error"});
  }
};

//update avatar
module.exports.UpdateAvatar = async (req, res) => {
  try {

    console.log("user", req.user);
    //delete user avatar image;
    const currentUser = await User.findById(req.user.user_id);
    const currentAvatarId = currentUser.avatar?.imageId;

    if (currentAvatarId) {
      await deleteFile(currentAvatarId);
    }

    const upload = multer({storage: storage}).array("img", 1);

    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).send({message: "upload failed", err: err});
      }

      //upload
      const image = [];
      const files = req.files;
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFileCreate(req.files, res, i);
        image.push(result);
      }

      try {
       

        //update user avatar

        const result = await User.findByIdAndUpdate(
          req.user.user_id,
          {avatar: image[0]},
          {returnDocument: "after"}
        );

        return res.status(200).send({message: "บันทึกสำเร็จ", data: result});
      } catch (error) {
        return res.status(400).send({message: "Mongo error", data: error});
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({message: "Internal Server Error", data: error});
  }
};
