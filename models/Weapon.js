const mongoose = require('mongoose');

const wschema = mongoose.Schema({
    weaponname: {
        type: String,
        required: true
    },
    damage: {
        type: Number,
        required: true
    },
    reload: {
        type: Number,
        required: true
    },
    magazine: {
        type: Number,
        required: true
    },
    magreload: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('weapons', wschema);