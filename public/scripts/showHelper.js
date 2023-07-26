const editReviewBtns = [...document.querySelectorAll('.edit-review-btn')];
const reviewCards = [...document.querySelectorAll('.review-card')];
const editReviewForms = [...document.querySelectorAll('.edit-form-container')];
const cancelEditBtns = [...document.querySelectorAll('.cancel-edit-btn')];

const editCoffeeBtn = document.querySelector('.edit-coffee-btn');
const cancelEditCoffeeBtn = document.querySelector('.cancel-edit-coffee-btn');
const newReviewForm = document.querySelector('.new-coffee-review-form')
 
const editCoffeeContainer = document.querySelector('.edit-coffee-container');
const coffeeCard = document.querySelector('.coffee-card');

 if(editCoffeeBtn){ 
  editCoffeeBtn.addEventListener('click', handleEditCoffeeBtn);  
  cancelEditCoffeeBtn.addEventListener('click', handleEditCoffeeBtn) }



 function handleEditCoffeeBtn(e){
  console.log(e.target)
   
   newReviewForm.classList.toggle('hidden')
   editCoffeeContainer.classList.toggle('hidden')
   coffeeCard.classList.toggle('hidden')
 }

// reviews


 editReviewBtns.forEach((btn)=>{
  btn.addEventListener('click', handleEditBtn)
 })
 
 function handleEditBtn(e) {
  console.log(e.target);

  const editFormTarget = editReviewForms.find(form => form.dataset.idx === e.target.dataset.idx);
  const reviewCardTarget = reviewCards.find(card => card.dataset.idx === e.target.dataset.idx);

  console.log(editFormTarget)
  console.log(reviewCardTarget)
  
  const showingForm = editReviewForms.find((form) => {
    let classList = [...form.classList];
    if(!classList.includes('hidden')){
      form.classList.toggle('hidden')
    }
  })

  const hiddenReview = reviewCards.find((card) => {
    let classList = [...card.classList];
    if(classList.includes('hidden')){
      card.classList.toggle('hidden')
    }
  })


  if (editFormTarget && reviewCardTarget) {
    editFormTarget.classList.toggle('hidden');
    reviewCardTarget.classList.toggle('hidden');
  } else {
    console.log('Node not found for the given dataset.idx');
  }
}




 cancelEditBtns.forEach((btn)=>{
 btn.addEventListener('click', handleCancelBtn)
 })

 function handleCancelBtn(e){

  e.preventDefault();  

  const editFormTarget = editReviewForms.find(form => form.dataset.idx === e.target.dataset.idx);
  const reviewCardTarget = reviewCards.find(card => card.dataset.idx === e.target.dataset.idx);

  if (editFormTarget && reviewCardTarget) {
    editFormTarget.classList.toggle('hidden');
    reviewCardTarget.classList.toggle('hidden');
  } else {
    console.log('Node not found for the given dataset.idx');
  }
}