const Coffee = require('../models/coffee');


module.exports = {
    create,
    // Add this export
    delete: deleteReview,
    update
  };
  
  async function deleteReview(req, res) {
    // Note the cool "dot" syntax to query on the property of a subdoc
    const coffee = await Coffee.findOne({ 'reviews._id': req.params.id, 'reviews.user': req.user._id });
    // Rogue user!
    if (!coffee) return res.redirect('/coffee');
    // Remove the review using the remove method available on Mongoose arrays
    coffee.reviews.remove(req.params.id);
    // Save the updated movie doc
    await coffee.save();
    // Redirect back to the movie's show view
    res.redirect(`/coffee/${coffee._id}`);
  }
  
  async function create(req, res) {
    const coffee = await Coffee.findById(req.params.id);
  
    // Add the user-centric info to req.body (the new review)
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
  
    // We can push (or unshift) subdocs into Mongoose arrays
    coffee.reviews.push(req.body);
    try {
      // Save any changes made to the movie doc
      await coffee.save();
    } catch (err) {
      console.log(err);
    }
    res.redirect(`/coffee/${coffee._id}`);
  }


// test this feature


  async function update(req, res) {


    try {
      await Coffee.findOneAndUpdate(
        {
          _id: req.params.coffeeId,
          'reviews._id': req.params.reviewId
        },
        {
          $set: {
            'reviews.$[review].content': req.body.content,
            'reviews.$[review].rating': req.body.rating
          }
        },
        {
          new: true,
          arrayFilters: [{ 'review._id': req.params.reviewId }]
        }
      ), (error,doc)=>{
        console.log(`in the callback`);
        console.log(doc);
      };
    
       
  

        res.redirect(`/coffee/${req.params.coffeeId}`)
     
    } catch (error) {
      console.error('Error updating coffee review:', error);
    }
}
  

  