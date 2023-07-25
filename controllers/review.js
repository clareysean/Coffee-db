const Coffee = require('../models/coffee');


module.exports = {
    create,
    // Add this export
    delete: deleteReview,
    update
  };
  
  async function deleteReview(req, res) {

    const coffee = await Coffee.findOne({ 'reviews._id': req.params.id, 'reviews.user': req.user._id });

    if (!coffee) return res.redirect('/coffee');

    coffee.reviews.remove(req.params.id);

    await coffee.save();

    res.redirect(`/coffee/${coffee._id}`);
  }
  
  async function create(req, res) {
    const coffee = await Coffee.findById(req.params.id);
  

    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
  
   
    coffee.reviews.push(req.body);
    try {
  
      await coffee.save();
    } catch (err) {
      console.log(err);
    }
    res.redirect(`/coffee/${coffee._id}`);
  }


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
  

  