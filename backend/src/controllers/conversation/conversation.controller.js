const {
  getAggregate,
  insertNewDocument,
  findAndPopulate,
} = require("../../helpers");
const { ObjectId } = require("mongodb");

// Create or fetch one-to-one conversation
const accessConversation = async (req, res) => {
  try {
    console.log(req.user.id);

    const { user_id } = req.body;

    // Check two users in a one-to-one conversation
    const agg = [
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "conversation_id",
          as: "members",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $setIsSubset: [
                  [new ObjectId(req.user.id), new ObjectId(user_id)],
                  "$members.user_id",
                ],
              },
              {
                $eq: [
                  {
                    $size: "$members",
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user_id",
          foreignField: "_id",
          as: "members.user",
        },
      },

      {
        $group: {
          _id: "$_id",
          conversation_name: {
            $first: "$conversation_name",
          },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          members: { $push: "$members" },
        },
      },
      {
        $project: {
          "members.user_id": 0, // Exclude redundant user_id field
          "members.user.password": 0, // Exclude redundant user_id field
        },
      },
    ];
    const response = await getAggregate("conversation", agg);
    // If have conversation then return it
    if (response.length > 0) {
      return res.status(200).send({ status: 200, data: response });
    }
    // If not, create conversation then add two member
    if (response.length === 0) {
      try {
        let conversation = await insertNewDocument("conversation", {
          conversation_name: req.user.id.concat("_", user_id),
        });

        const member_me = await insertNewDocument("member", {
          user_id: req.user.id,
          conversation_id: conversation._id,
          joined_at: new Date(),
        });

        const member_user = await insertNewDocument("member", {
          user_id: user_id,
          conversation_id: conversation._id,
          joined_at: new Date(),
        });

        const me_populated = await findAndPopulate(
          "member",
          {
            user_id: member_me.user_id,
          },
          "user_id",
          "-password"
        );

        const user_populated = await findAndPopulate(
          "member",
          {
            user_id: member_user.user_id,
          },
          "user_id",
          "-password"
        );

        const updatedMePopulated = me_populated.map(({ user_id, ...rest }) => ({
          ...rest,
          user: [user_id],
        }));
        const updatedUserPopulated = user_populated.map(
          ({ user_id, ...rest }) => ({ ...rest, user: [user_id] })
        );

        return res.status(200).send({
          status: 200,
          data: [
            {
              ...conversation._doc,
              members: [updatedMePopulated[0], updatedUserPopulated[0]],
            },
          ],
        });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ status: 500, error: error });
      }
    }
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

// Fetch all conversation (one-to-one and group chat)
const getConversation = async (req, res) => {
  try {
    console.log(req.user.id);

    const agg = [
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "conversation_id",
          as: "members",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $size: "$members" }, 2] },
              {
                $setIsSubset: [[new ObjectId(req.user.id)], "$members.user_id"],
              },
            ],
          },
        },
      },
      {
        $unwind: "$members",
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user_id",
          foreignField: "_id",
          as: "members.user",
        },
      },

      {
        $group: {
          _id: "$_id",
          conversation_name: {
            $first: "$conversation_name",
          },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          members: { $push: "$members" },
        },
      },
      {
        $project: {
          "members.user_id": 0, // Exclude redundant user_id field
          "members.user.password": 0, // Exclude redundant user_id field
        },
      },
    ];

    const response = await getAggregate("conversation", agg);
    return res.status(200).send({ status: 200, data: response });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = { accessConversation, getConversation };
