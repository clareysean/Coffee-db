const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
      type: String,
      required: true
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

// when user is not required the app works well, when it is, the req.body gets wiped out, is empty when logged in the create method in the coffee controller
const coffeeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      userName: String,
      userAvatar: String,

      name:{ type: String, required: true },
      roaster: { type: String, required: true },
      imageUrl: { type: String, required: false },
      roastDate: { type: Date, default: function() {
        return new Date();
      }},
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