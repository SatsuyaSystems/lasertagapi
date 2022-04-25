const mongoose = require('mongoose');

const games = new mongoose.Schema({
    name: {
        type: String,
        default: "root"
    },
    time: {
        type: Number,
        required: true
    },
    regeneration: {
        type: Boolean,
        required: true
    },
    regrate: {
        type: Number,
        required: true
    },
    lives: {
        type: Number,
        required: true
    },
    teams: {
        type: Boolean,
        required: true
    },
    friendlyfire: {
        type: Boolean,
        required: true
    },
    unitabilities: {
        type: Boolean,
        required: true
    },
    killstreak: {
        type: Boolean,
        required: true
    },
    infammo: {
        type: Boolean,
        required: true
    },
    shield: {
        type: Boolean,
        required: true
    },
    items: {
        type: Boolean,
        required: true
    }
});

const game = mongoose.model('game', games);

module.exports = game;