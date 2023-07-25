const Coffee = require('../models/coffee');
const multer = require('multer');

// Set up Multer to store uploaded images in the 'public/uploads' directory
const upload = multer({ dest: 'public/uploads/' });

module.exports = {
  index,
  new: newCoffee,
  create,
  show,
  update,
  delete: deleteCoffee
};

// Your existing controller functions go here...


async function index(req,res){
    const coffees = await Coffee.find({});
    res.render('coffee/index', { coffees })
}

function newCoffee (req,res){

    const coffeeForDefaultDate = new Coffee;
    const rD = coffeeForDefaultDate.roastDate;

    let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
    roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

    //this is the format to feed to the date input as default

    if(!req.user){
      res.redirect(`/auth/google`)
    }

    res.render('coffee/new', { roastDate });
}

async function show(req,res){
    const coffee = await Coffee.findById(req.params.id);

    const rD = coffee.roastDate;

    let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
    roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;


    // console.log(coffee.roastDate)
    res.render('coffee/show', { coffee, roastDate: roastDate });
}



async function create(req, res) {
    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key];
    }
    try {
      upload.single('image')(req, res, async function (err) {
        if (err) {
          console.error('Error uploading image:', err);
          return res.status(500).send('Error uploading image');
        }
  
        if (req.file) {
          req.body.imageUrl = '/uploads/' + req.file.filename;
        }
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        // req.body.roastDate = req.body.roastDate.toISOString().slice(0, 10)

        const coffeeForDefaultDate = new Coffee;
        const rD = coffeeForDefaultDate.roastDate;
    
        let defaultRoastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
        defaultRoastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;

        const submittedDate = new Date(req.body.roastDate);
        const todaysDate = new Date();
        console.log(submittedDate)
        console.log(todaysDate)

        if(submittedDate>todaysDate){
          console.error('Error creating coffee:', err);
          res.render('coffee/new', { errorMsg: 'The roast date cannot be in the future!', roastDate: defaultRoastDate.toString});
          return;
        }

        const dateInUTC = new Date(
          Date.UTC(
            submittedDate.getFullYear(),
            submittedDate.getMonth(),
            submittedDate.getDate(),
            submittedDate.getHours(),
            submittedDate.getMinutes()
          )
        );

        req.body.roastDate = dateInUTC
        console.log(req.body)
        try {
          console.log(req.body.roastDate)
          const coffee = await Coffee.create(req.body);
          res.redirect(`/coffee/${coffee._id}`);
        } catch (err) {
          console.error('Error creating coffee:', err);
          res.render('coffee/new', { errorMsg: 'Error creating coffee: Please fill out all required fields.', roastDate: defaultRoastDate});
        }
      });
    } catch (err) {
      console.error('Error uploading image:', err);
      res.render('coffee/new', { errorMsg: 'Error uploading image' });
    }
  }

 async function update(req,res){

    upload.single('image')(req, res, async function (err) {

      if (err) {
        console.error('Error uploading image:', err);
        return res.status(500).send('Error uploading image');
      }
      if (req.file) {
         req.body.imageUrl = '/uploads/' + req.file.filename;
      }

     // not sure this is even necessary sine the datetime-local input has a default value assigned when the show page is rendered. 

      // if(!req.body.roastDate){
         
        const coffeeForDefaultDate = new Coffee;
        const defaultRoastDate = coffeeForDefaultDate.roastDate;
      //   const rD = coffeeForDefaultDate.roastDate;
      //   let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
      //   roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;
      //   req.body.roastDate = roastDate;
      // }
      
      const coffee = await Coffee.findById(req.params.id);
      
      const updatedDate = new Date(req.body.roastDate);
      const todaysDate = new Date();

      if(updatedDate>todaysDate){
        console.error('Error updating coffee:', err);
        res.render('coffee/show', { coffee: coffee, roastDate: defaultRoastDate, errorMsg: '*Update failed: The roast date cannot be in the future!'});
        return;
      }

      if(!req.body.name || !req.body.roaster || !req.body.initReview){
        
        res.render(`coffee/show`, { coffee: coffee, errorMsg: '*Update failed due to missing fields; please provide a name and a roaster for your entry!' });
        return;
      }
        await Coffee.findOneAndUpdate({'_id': req.params.id}, {$set: req.body});
        res.redirect(`/coffee/${req.params.id}`)
    });
   } 


async function deleteCoffee(req,res){
    await Coffee.findByIdAndDelete(req.params.id);
    res.redirect(`/coffee`)
}