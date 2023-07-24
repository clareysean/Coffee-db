const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const coffeeSchema = require('./coffee').schema;

const userFavouriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      userName: String,
      userAvatar: String,
    favourites: [coffeeSchema]
})



module.exports = mongoose.model('UserFavourite', userFavouriteSchema);