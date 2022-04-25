const mongoose = require('mongoose');

const cschema = mongoose.Schema({
    classname: {
        type: String,
        required: true
    },
    shield: {
        type: Number,
        required: true
    },
    health: {
        type: Number,
        required: true
    },
    luck: {
        type: Number,
        required: true
    },
    armor: {
        type: Number,
        required: true
    },
    knockofftime: {
        type: Number,
        required: true
    },
    regrate: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('classes', cschema);