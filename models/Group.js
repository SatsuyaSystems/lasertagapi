const mongoose = require('mongoose');

const groups = new mongoose.Schema({
    group: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    game: {
        type: String,
        default: "null"
    }
});

const group = mongoose.model('groups', groups);

module.exports = group;