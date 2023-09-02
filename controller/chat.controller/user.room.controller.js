const { ChatRoom } = require('../../models/chat.model/user.room.model')
const { User } = require('../../models/user.model')
const { UserInvite } = require('../../models/chat.model/user.invite.model')
const { Task } = require('../../models/task.model')
const multer = require('multer')
// var { uploadFileCreate, deleteFile } = require("../../lib/uploadservice");
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        //console.log(file.originalname);
    },
});


module.exports.createRoom = async (req, res) => {
    try {
        const id = req.user.user_id
        const findUser = await User.findById(id)

        if (!findUser) {
            return res.status(403).send({ message: 'ไม่พบข้อมูล user' })
        } else {
            const userData = []
            userData.push({
                userid: findUser._id,
                username: findUser.name,
                usersurname: findUser.surname,
                useremail: findUser.email,
                usertel: findUser.tel
            })

            const data = {
                roomId: uuidv4(),
                users: userData,
                roomName: req.body.roomName,
                avatar: findUser.avatar,
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
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}

module.exports.GetRoomByUserID = async (req, res) => {
    try {
        const id = req.user.user_id
        console.log(req.user)
        const pipeline = [
            {
                $unwind: '$users'
            },
            {
                $match: { 'users.userid': id }
            },
            {
                $project: {
                    roomId: 1,
                    users: 1,
                    roomName: 1,
                    avatar: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]

        const result = await ChatRoom.aggregate(pipeline)

        return res.status(200).send({ message: 'Success', data: result })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}

module.exports.InviteUser = async (req, res) => {
    try {
        const findUser = await User.findOne({ username: req.body.username })
        const id = req.params.roomId

        // create user invite
        const data = {
            roomId: id,
            name: findUser.name,
            surname: findUser.surname,
            username: findUser.username,
            email: findUser.email,
            tel: findUser.tel
        }
        const userinvite = new UserInvite(data)
        await userinvite.save();
        if (!userinvite) {
            return res.status(400).send({ message: 'Invited Unsuccessfully!', data: error });
        } else {
            const taskdata = {
                from: req.user.user_id,
                to: findUser._id,
                decription: 'คำเชิญเข้าร่วมห้องแชท'
            }
            const task = new Task(taskdata)
            try {
                await task.save();
                return res.status(200).send({ message: 'Invited Successfully!', data: userinvite });
            } catch (error) {
                console.log(error);
                return res.status(400).send({ message: 'Invited Unsuccessfully!', data: error });
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}

module.exports.Accept = async (req, res) => {
    try {
        const id = req.params._id
        const task = await Task.find({ to: id })
        if (!task) {
            return res.status(403).send({ message: 'ไม่มีการแจ้งเตือนนี้อยู่แล้ว' })
        } else {
            const findUser = await User.findById(task.to)
            if (!findUser) {
                return res.status(403).send({ message: 'ไม่พบ User' })
            } else {
                const findUserInvite = await UserInvite.findOne({ username: findUser.username })
                if (!findUserInvite) {
                    return res.status(403).send({ message: 'ไม่พบคำเชิญนี้อยู่แล้ว' })
                } else {
                    const findChat = await ChatRoom.findOne({ roomId: findUserInvite.roomId })
                    if (!findChat) {
                        return res.status(403).send({ message: 'ไม่มีห้องแชทนี้อยู่แล้ว' })
                    } else {
                        const userData = []
                        userData.push({
                            userid: findUser._id,
                            username: findUser.name,
                            usersurname: findUser.surname,
                            useremail: findUser.email,
                            usertel: findUser.tel
                        })
                        await ChatRoom.findByIdAndUpdate(findChat._id, { users: userData })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}