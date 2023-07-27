const Coffee = require('../models/coffee');
const UserFavourite = require('../models/favourite')

module.exports={
    create,
    index,
    delete: deleteFavourite
}

async function create(req, res) {
    const newFavouriteCoffee = await Coffee.findById(req.params.id);
  
    try {
      const userFavouriteDoc = await UserFavourite.findOne({ user: req.user._id });

      if (userFavouriteDoc) { 
        if(userFavouriteDoc.favourites.some(fav => fav._id.equals(newFavouriteCoffee._id))){
            res.render('coffee/favourites', { coffees: userFavouriteDoc.favourites });
      
        } else {
            userFavouriteDoc.favourites.push(newFavouriteCoffee);
            await userFavouriteDoc.save();
            res.render('coffee/favourites', { coffees: userFavouriteDoc.favourites });
        }    
      } else {
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
  

  async function index (req,res){
    console.log(`in index favs`)
    if(req.user){
      try{        
        const userFavouriteDoc = await UserFavourite.findOne({ user: req.user._id });
        res.render('coffee/favourites', { coffees: userFavouriteDoc.favourites });
      return;}
        catch(err){
          console.log(err);
          res.render('coffee/favourites', { errorMsg: `You don't have any favourites yet.` })
          return;
        }

    }    
  }

  async function deleteFavourite (req,res){
    const userFavouriteDoc = await UserFavourite.findOne({ user: req.user._id });
    userFavouriteDoc.favourites.remove(req.params.id)
    await userFavouriteDoc.save();
    res.redirect('/coffee/favourites');
  }

  