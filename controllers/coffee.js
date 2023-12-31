const Coffee = require("../models/coffee");
const FavDoc = require("../models/favourite");

module.exports = {
  index,
  new: newCoffee,
  create,
  show,
  update,
  delete: deleteCoffee,
};

async function index(req, res) {
  const coffees = await Coffee.find({});
  res.render("coffee/index", { coffees });
}

function newCoffee(req, res) {
  if (!req.user) {
    res.redirect(`/auth/google`);
  }

  res.render("coffee/new");
}

async function show(req, res) {
  try {
    const coffee = await Coffee.findById(req.params.id);
    console.log(req.params.id);
    console.log(coffee);

    return res.render("coffee/show", { coffee });
  } catch (err) {
    console.error("Error rendering show page:", err);
  }
}

async function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }

  console.log(req.body);

  // const coffeeForDefaultDate = new Coffee;

  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  const submittedDate = new Date(req.body.roastDate);
  const todaysDate = new Date();

  //new conditionals
  if (
    !req.body.roastDate ||
    req.body.roastDate === null ||
    req.body.roastDate === undefined ||
    submitted > todaysDate
  ) {
    console.error("Error creating coffee");
    res.render("coffee/new", { errorMsg: "Please pick a valid roast date." });
    return;
  }
  try {
    const coffee = await Coffee.create(req.body);
    res.redirect(`/coffee/${coffee._id}`);
  } catch (err) {
    console.error("Error creating coffee:", err);
    res.render("coffee/new", {
      errorMsg: "Error creating coffee: Please fill out all required fields.",
    });
  }
}

async function update(req, res) {
  console.log(req.body);

  const coffee = await Coffee.findById(req.params.id);

  const rD = coffee.roastDate;
  let roastDate = `${rD.getFullYear()}-${(rD.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  roastDate += `-${rD.getDate().toString().padStart(2, "0")}T${rD
    .toTimeString()
    .slice(0, 5)}`;

  const updatedDate = new Date(req.body.roastDate);
  const todaysDate = new Date();

  if (updatedDate > todaysDate) {
    console.error("Error updating coffee:");
    res.render("coffee/show", {
      coffee: coffee,
      defaultRoastDate: roastDate,
      errorMsg: "*Update failed: The roast date cannot be in the future!",
    });
    return;
  }
  if (req.body.imageUrl) {
    if (!/^http:\/\/.*/.test(req.body.imageUrl)) {
      console.error("Invalid imageUrl:", req.body.imageUrl);
      res.render("coffee/show", {
        coffee: coffee,
        defaultRoastDate: roastDate,
        errorMsg: "*Invalid Image URL format!",
      });
      return;
    }
  }
  if (
    !req.body.imageUrl ||
    !req.body.name ||
    !req.body.roaster ||
    !req.body.initReview ||
    !req.body.roastDate ||
    req.body.roastDate === null
  ) {
    console.log(`guard one`);
    res.render(`coffee/show`, {
      coffee: coffee,
      defaultRoastDate: roastDate,
      errorMsg: "*Update failed due to missing fields!",
    });
    return;
  }
  try {
    await Coffee.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.redirect(`/coffee/${req.params.id}`);
  } catch (err) {
    console.error(err);
    console.log(`guard two`);
    res.render(`coffee/show`, {
      coffee: coffee,
      defaultRoastDate: roastDate,
      errorMsg: "*Update failed due to missing fields!",
    });
    return;
  }
}

async function deleteCoffee(req, res) {
  const coffee = await Coffee.findByIdAndDelete(req.params.id);

  try {
    await FavDoc.updateMany(
      {},
      { $pull: { favourites: { name: coffee.name } } }
    );

    console.log(`${updateResult.modifiedCount} documents removed.`);
  } catch (err) {
    console.error("Error deleting documents:", err);
  }

  res.redirect(`/coffee`);
}
