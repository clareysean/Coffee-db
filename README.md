# CoffeeDB

![CoffeeDB](https://i.imgur.com/5ah6HYP.png)

CoffeeDB is a web app built using Express, Node.js, EJS, Mongoose, and MongoDB where users can interact with a coffee database. Users can add their favorite coffee roasts, review existing roasts, edit their posts and reviews, and build a favorites list of roasts.

## Visit Deployed Page: [here](https://coffeedb-8dceb2e9375b.herokuapp.com/)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

1. **Add a Roast**: Users can add roasts to the database, providing details like roast name, roast date, flavour scores, and description.

2. **Review Roasts**: Users can browse roasts and leave reviews, including a rating and comments.

3. **Edit Posts and Reviews**: Users can edit their own posts and reviews.

4. **Favorites List**: Users can create a personalized favorites list.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/coffee-database.git
cd coffee-database
```

2. Install dependencies:

```bash
npm install
```

3. Configure MongoDB:

   - Make sure you have MongoDB installed and running.
   - Update the MongoDB connection string in `config/database.js` with your own MongoDB Database URL.

## Usage

To start the server, run the following command:

```bash
npm start
```

Visit `http://localhost:3000` in your web browser to access the Coffee Database website.


## Database Schema

The MongoDB database contains three main collections:

### User Schema

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

### Review Schema

```javascript
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
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
```

### Coffee Schema

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = require('./review').schema;

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
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Coffee', coffeeSchema);
```

### UserFavourite Schema

```javascript
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
});

module.exports = mongoose.model('UserFavourite', userFavouriteSchema);
```

## Contributing

Contributions are welcome. If you spot issues or have suggestions feel free to open an issue or create a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as per the terms of the license.