const mongoose = require('mongoose');
const { Schema } = mongoose;

const currentTime = new Date();
const localtime = currentTime.toLocaleString();

const UserSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    LastLoginTime: {
        type: String,
        default: localtime
    }
})
// Users is the collection where users data is going to be stored.

const User = mongoose.model('Users', UserSchema);
module.exports = User;