const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
      type: String,
      required: false
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {type: String, required: true},
    userAvatar: {type: String, required: true}
  }, {
    timestamps: true
  });


  const coffeeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: String,
    userAvatar: String,

    name: { type: String, required: true },
    roaster: { type: String, required: true },
    imageUrl: { type: String, required: true, match: /^http:\/\/.*/ },
    roastDate: {
        type: Date,
        required: true,
        default: function () {
            return new Date();
        }
    },

    aroma: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    acidity: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    bodyRating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    balance: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    sweetness: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    initReview: { type: String, required: true },
    reviews: [reviewSchema],
}, {
    timestamps: true
});


  module.exports = mongoose.model('Coffee', coffeeSchema);