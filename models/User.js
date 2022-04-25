const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    class: {
        type: String,
        default: "none"
    },
    weapon: {
        type: String,
        default: "none"
    },
    points: {
        type: Number,
        default: 0
    },
    killstreak: {
        type: Number,
        default: 0
    },
    ready: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    terminal: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('users', UserSchema);