const Coffee = require('../models/coffee');
const UserFavourite = require('../models/favourite')

module.exports={
    create
}

async function create(req, res) {
    const newFavouriteCoffee = await Coffee.findById(req.params.id);
  
    try {
      const userFavouriteDoc = await UserFavourite.findOne({ user: req.user._id });
  
      if (userFavouriteDoc) { console.log(`found a user favs doc`)
        if(userFavouriteDoc.favourites.some(fav => fav._id.equals(newFavouriteCoffee._id))){ console.log(`it had the doc in it`)
            res.render('coffee/favourites', { coffees: userFavouriteDoc.favourites });
      
        } else {
            console.log(`it didn't have the doc in it`)
            userFavouriteDoc.favourites.push(newFavouriteCoffee);
            await userFavouriteDoc.save();
            res.render('coffee/favourites', { coffees: userFavouriteDoc.favourites });
        
        }
     

      } else {

        console.log(`didn't find a user favs doc`)
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
  
        const newFavouriteDoc = await UserFavourite.create(req.body);
        newFavouriteDoc.favourites.push(newFavouriteCoffee);
        await newFavouriteDoc.save();
        res.render('coffee/favourites', { coffees: newFavouriteDoc.favourites });
      }
  
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  }
  