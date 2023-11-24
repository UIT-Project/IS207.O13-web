// Select all elements with class '.fa-solid fa-star'
var stars = document.querySelectorAll(".fa-star");

stars.forEach((star, index) => {
    star.onclick = function() {
        for (let i = 0; i <= index; i++) {
            stars[i].style.color = "#ffd93b";
        }
        for (let i = index + 1; i < stars.length; i++) {
            stars[i].style.color = "#e4e4e4";
        }
    };
});
