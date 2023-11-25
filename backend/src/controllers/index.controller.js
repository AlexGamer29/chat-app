const { getUsers, addUser, deleteUser, updateUser, deleteUsers } = require("./user/user.controller")

const { signUp, logIn } = require("./auth/auth.controller")

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    deleteUsers,
    signUp,
    logIn
};