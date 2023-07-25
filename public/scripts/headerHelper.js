const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', ()=> {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
})

const allNavLinks = [...document.querySelectorAll('.nav-link')]

allNavLinks.forEach(link => link.addEventListener('click', ()=> {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
}))