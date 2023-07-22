const Coffee = require('../models/coffee');
const multer = require('multer');

// Set up Multer to store uploaded images in the 'public/uploads' directory
const upload = multer({ dest: 'public/uploads/' });

module.exports = {
  index,
  new: newCoffee,
  create,
  show,
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

    res.render('coffee/new', { roastDate });
}

async function show(req,res){
    console.log(`in the show method`);
    const coffee = await Coffee.findById(req.params.id);
    console.log(coffee);
    res.render('coffee/show', { coffee });
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
  
        // If there was no error during image upload, continue with saving the Coffee document
        if (req.file) {
          // Save the image URL to the coffee document
          req.body.imageUrl = '/uploads/' + req.file.filename;
        }
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        console.log(req.body)
        const coffee = await Coffee.create(req.body);
        res.redirect(`/coffee/${coffee._id}`);
      });
    } catch (err) {
      console.error('Error creating coffee:', err);
      return res.status(500).send('Error creating coffee');
    }
  }
  