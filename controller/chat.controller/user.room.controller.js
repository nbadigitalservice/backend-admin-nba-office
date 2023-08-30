const { ChatRoom } = require('../../models/chat.model/user.room.model')
const { User } = require('../../models/user.model')
const multer = require('multer')
var { uploadFileCreate, deleteFile } = require("../../lib/uploadservice");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        //console.log(file.originalname);
    },
});


module.exports.createRoom = async (req, res) => {
    try {
        const upload = multer({ storage: storage }).array("img", 20);

        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).send({ message: "upload failed", err: err });
            }
            const image = [];
            const files = req.files;
            for (let i = 0; i < files.length; i++) {
                const result = await uploadFileCreate(req.files, res, i);
                image.push(result);
            };

            const id = req.user.user_id
            const findUser = await User.findById(id)
            console.log('findUserfindUserfindUser', findUser)

            if (!findUser) {
                return res.status(403).send({ message: 'ไม่พบข้อมูล user' })
            } else {
                const userData = []
                userData.push({
                    user_id: findUser._id,
                    user_name: findUser.name,
                    user_surname: findUser.surname,
                    user_email: findUser.email,
                    user_tel: findUser.tel
                })

                const data = {
                    users: userData,
                    name: req.body.name,
                    image: image[0],
                }
                const createroom = new ChatRoom(data)
                try {
                    await createroom.save();
                    return res.status(200).send({ message: 'สร้างห้องแชทสำเร็จ', data: createroom });
                } catch (error) {
                    console.log(error);
                    return res.status(400).send({ message: 'ไม่สามารถสร้างห้องแชทได้', data: error });
                }
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}