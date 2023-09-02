const { Task } = require('../models/task.model')

module.exports.GetTaskByUserId = async (req, res) => {
    try {
        const id = req.user.user_id
        console.log(id)
        const pipeline = [
            {
                $match: { to: id }
            },
            {
                $addFields: {
                    id: { $toObjectId: "$from" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "id",
                    foreignField: "_id",
                    as: "userdata"
                }
            },
            {
                $project: {
                    from: "$userdata.username",
                    to: req.user.name,
                    decription: 1,
                    createdAt: 1,
                    avatar: "$userdata.avatar"
                }
            }
        ]

        const GetTask = await Task.aggregate(pipeline).exec();
        return res.status(200).send({ status: true, message: 'Successfully', data: GetTask });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Internal Server', data: error })
    }
}