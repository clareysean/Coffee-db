const Coffee = require('../models/coffee');
const FavDoc = require('../models/favourite')
const mongoose = require('mongoose')

module.exports = {
  index,
  new: newCoffee,
  create,
  show,
  update,
  delete: deleteCoffee
};



async function index(req,res){
    const coffees = await Coffee.find({});

    res.render('coffee/index', { coffees })
}

function newCoffee (req,res){

    const coffeeForDefaultDate = new Coffee;
    const rD = coffeeForDefaultDate.roastDate;

    let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
    roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

    if(!req.user){
      res.redirect(`/auth/google`)
    }

    res.render('coffee/new', { roastDate });
}

async function show(req, res) {
  try {

      const coffee = await Coffee.findById(req.params.id);
      console.log(req.params.id);
      console.log(coffee);

      const rD = coffee.roastDate;
      let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
      roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

      return res.render('coffee/show', { coffee, defaultRoastDate: roastDate });
  } catch (err) {
      console.error('Error rendering show page:', err);
  }
}



async function create(req, res) {
    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key];
    }

    console.log(req.body);


    const coffeeForDefaultDate = new Coffee;
    const rD = coffeeForDefaultDate.roastDate;

    let defaultRoastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
    defaultRoastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
        
    const submittedDate = new Date(req.body.roastDate);
    const todaysDate = new Date();
    console.log(submittedDate);
    console.log(todaysDate);

    if(submittedDate>todaysDate){
          console.error('Error creating coffee');
          res.render('coffee/new', { errorMsg: 'Please pick a valid roast date.', roastDate: defaultRoastDate.toString});
          return;
        }
        try{
          const coffee = await Coffee.create(req.body);
          res.redirect(`/coffee/${coffee._id}`);
        }
          catch(err){
            console.error('Error creating coffee:', err);
            res.render('coffee/new', { errorMsg: 'Error creating coffee: Please fill out all required fields.', roastDate: defaultRoastDate});
          }
}

 async function update(req,res){

  console.log(req.body)

      const coffee = await Coffee.findById(req.params.id);
      // console.log()
      const roastDate = coffee.roastDate;

      // let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
      // roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

      const updatedDate = new Date(req.body.roastDate);
      const todaysDate = new Date();

      if(updatedDate>todaysDate){
        console.error('Error updating coffee:', err);
        res.render('coffee/show', { coffee: coffee, defaultRoastDate: roastDate, errorMsg: '*Update failed: The roast date cannot be in the future!'});
        return;
      }
       
      if(!req.body.name || !req.body.roaster || !req.body.initReview){

        // maybe add guard against missing image link
        console.log(`guard one`)
        res.render(`coffee/show`, { coffee: coffee, defaultRoastDate: roastDate, errorMsg: '*Update failed due to missing fields; please provide a name, a roaster, and a date for your entry!' });
        return;
      }
      
        try{
          await Coffee.findOneAndUpdate({'_id': req.params.id}, {$set: req.body});
          res.redirect(`/coffee/${req.params.id}`)
      } catch(err){
          console.error(err);
          console.log(`guard two`)
          res.render(`coffee/show`, { coffee: coffee, defaultRoastDate: roastDate, errorMsg: '*Update failed due to missing fields; please provide a name, a roaster, and a date for your entry!' });
          return;
      }
    }
 


async function deleteCoffee(req,res){
    const coffee = await Coffee.findByIdAndDelete(req.params.id);

    try{ await FavDoc.updateMany(
      {},
      { $pull: { favourites: { name: coffee.name } } }
    );

    console.log(`${updateResult.modifiedCount} documents removed.`);

    } catch (err) {
      console.error('Error deleting documents:', err);
    }

    res.redirect(`/coffee`)
}