const burger = document.querySelector(".burger");
const navMenu = document.querySelector(".nav-menu");
const navItems = [...document.querySelectorAll(".nav-item")];

burger.addEventListener("click", () => {
  if (navItems.length <= 2)
    navItems.forEach((item) => item.classList.add("no-user-nav-menu"));
  burger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

const allNavLinks = [...document.querySelectorAll(".nav-link")];

allNavLinks.forEach((link) =>
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);
