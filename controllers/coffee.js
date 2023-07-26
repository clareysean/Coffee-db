const Coffee = require('../models/coffee');
const multer = require('multer');



const maxSize = 209152;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const originalFileExtension = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + originalFileExtension);
  }
});


const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    if(
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format"))
    }
  },
  limits: { fileSize: maxSize },
}).single('image')



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


    res.render('coffee/show', { coffee, roastDate: roastDate });
}



async function create(req, res) {
    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key];
    }


    const coffeeForDefaultDate = new Coffee;
    const rD = coffeeForDefaultDate.roastDate;

    let defaultRoastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
    defaultRoastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;


    try {
      upload(req, res, async function (err) {
        if (err) {
          console.error('Error uploading image:', err);
          res.render('coffee/new', { errorMsg: 'Image upload failed. Please upload a .png, .jpg or .jpeg image under 2MB', roastDate: defaultRoastDate.toString});
        }
  
        if (req.file) {
          req.body.imageUrl = '/uploads/' + req.file.filename;
        }

        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.userAvatar = req.user.avatar;
        
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

    upload(req, res, async function (err) {

      const coffee = await Coffee.findById(req.params.id);

      const coffeeForDefaultDate = new Coffee;
      const defaultRoastDate = coffeeForDefaultDate.roastDate;

      if (err) {
        console.error('Error uploading image:', err);
        res.render('coffee/show', { coffee: coffee, roastDate: defaultRoastDate, errorMsg: '*Update failed: Image upload failed. Please upload a .png, .jpg or .jpeg image under 2MB'});
        return;
      }
      if (req.file) {
         req.body.imageUrl = '/uploads/' + req.file.filename;
      }

     // not sure this is even necessary sine the datetime-local input has a default value assigned when the show page is rendered. 

      // if(!req.body.roastDate){
         
      
      //   const rD = coffeeForDefaultDate.roastDate;
      //   let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1).toString().padStart(2, '0')}`;
      //   roastDate += `-${rD.getDate().toString().padStart(2, '0')}T${rD.toTimeString().slice(0, 5)}`;
      //   req.body.roastDate = roastDate;
      // }
      
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