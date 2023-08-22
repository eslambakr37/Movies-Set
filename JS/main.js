"use strict"

//Start navbar behavior
let navOpener = document.querySelector(".nav-contloler i"); //select navbar toggler
let smallNavOpener = document.querySelector('.small-nav-controller');
let smallNavOpenerIcon = document.querySelector('.small-nav-controller i'); //select navbar toggler at small screens
let li = document.querySelectorAll(".sections li"); //select navebar list itmes
let navbarState = 'close';
navOpener.addEventListener('click', navContloler);
smallNavOpener.addEventListener('click', navContloler);

function navContloler() {
    let staticNav = document.querySelector(".static-nav"); //select static part in navbar
    let staticNavStyle = window.getComputedStyle(staticNav);
    let innerContent = document.querySelector(".inner-content"); //select inner content of dynamic part in navbar
    let socilAndCopy = document.querySelector('.socil-copy');
    let dynamicNav = document.querySelector(".dynamic-nav"); //select dynamic part in navbar
    let state = 0;
    if (staticNavStyle.getPropertyValue('display') == 'none') {
        staticNavStyle = window.getComputedStyle(smallNavOpener);
        state = 'small screen';
    }
    innerContent.classList.replace('d-none', 'd-flex');
    if (staticNavStyle.getPropertyValue('left') == '0px') {
        if (state == 'small screen') {
            smallNavOpener.style.left = `50%`;
            dynamicNav.style.width = `50%`;
        }
        else {
            staticNav.style.left = `16%`;
            dynamicNav.style.width = `16%`;
        }
        for (let i = 0; i < li.length; i++) {
            li[i].style.animationDelay = `${(i / 10)}s`
            li[i].style.animationName = 'top-move';
            li[i].style.top = '0%';
        }
        socilAndCopy.style.animationName = 'top-move';
        socilAndCopy.style.top = '0%';
        navOpener.classList.add('fa-rotate-90');
        smallNavOpenerIcon.classList.add('fa-rotate-90');
        smallNavOpenerIcon.classList.add('active');
        navbarState = 'open';
    }
    else {
        for (let i = 0; i < li.length; i++) {
            li[i].style.top = '250%';
        }
        socilAndCopy.style.top = '250%'
        innerContent.classList.replace('d-flex', 'd-none');
        smallNavOpener.style.left = 0;
        staticNav.style.left = 0;
        dynamicNav.style.width = 0;
        smallNavOpenerIcon.classList.remove('fa-rotate-90');
        navOpener.classList.remove('fa-rotate-90');
        smallNavOpenerIcon.classList.remove('active');
        navbarState = 'close';
    }

}

let navbar = document.querySelectorAll('nav *');
window.addEventListener('click', function (e) {
    let action = 'close';
    for (let i = 0; i < navbar.length; i++) {
        if (e.target == navbar[i]) {
            action = 'open';
        }
    }
    if (action == 'close' && navbarState == 'open') {
        navContloler();
    }
})
//End navbar behavior


let finalResult = [];
let posterImg = 0;

//GET content from API
async function getMovies(path) {
    let Response = await fetch(`https://api.themoviedb.org/3/${path}?language=en-US&page=1&api_key=861c6caa67ca6de1e1fa1dbde7a2fac3`);
    let page1 = (await Response.json()).results;
    Response = await fetch(`https://api.themoviedb.org/3/${path}?language=en-US&page=2&api_key=861c6caa67ca6de1e1fa1dbde7a2fac3`);
    let page2 = (await Response.json()).results;
    finalResult = page1.concat(page2);
    dispalyMovies(finalResult);
    checkFavList(finalResult);
}

//Dispaly content
let favButton = 0;
let cartoona = ``;
function dispalyMovies(arr) {
    cartoona = ``;
    for (let i = 0; i < arr.length; i++) {
        cartoona += `<div class="col-md-6 col-lg-4 py-3 text-white">
        <div class="poster  rounded-2 position-relative overflow-hidden">
        <img id="poster_path" class="w-100 poster-img rounded-2" src="https://image.tmdb.org/t/p/w500${arr[i].poster_path}" alt="">
        <div class="movie-details position-absolute d-flex flex-column justify-content-center text-black w-100 h-100">
        <h3  id="title" class="py-2">${arr[i].title}</h3>
        <p  id="overview" class="px-2" >${arr[i].overview}</p>
        <h5 id="vote_average" >   Vote Average: <span>${arr[i].vote_average}</span></h5>
        <h5 id="vote_count">   Vote Count: <span>${arr[i].vote_count}</span></h5>
        <p id="release_date">   ${arr[i].release_date}</p>
        <i class="add-fav fa-solid fa-heart fs-3"></i>
        
    </div>
</div>
</div>`;
    }
    document.querySelector('#posters').innerHTML = cartoona;
    favButton = document.querySelectorAll('.poster .add-fav');
    for (let i = 0; i < favButton.length; i++) {
        favButton[i].addEventListener('click', function () {
            if (favButton[i].classList.contains('active')) {
                favButton[i].classList.remove('active');
                removeFromFav(finalResult[i]);
            }
            else {
                favButton[i].classList.add('active');
                addToFav(finalResult[i]);
            }

        });
    }
    checkFavList(arr);
}


(async function () {
    await getMovies('movie/now_playing');
    li[0].classList.add('active');

})();






// Change between APIS
for (let i = 0; i < li.length; i++) {
    li[i].addEventListener('click', function (e) {
        switch (this.attributes.id.nodeValue) {
            case 'trending':
                getMovies('trending/movie/day');
                break;
            case 'favorites':
                disFav(favMoviesArr);
                break;
            default:
                getMovies(`movie/${this.attributes.id.nodeValue}`);
                break;
        }
        for (let j = 0; j < li.length; j++) {
            li[j].classList.remove('active');
        }
        li[i].classList.add('active');

    });
}

// get favorites from local storage
let favMoviesArr = [];
if (localStorage.getItem("favoritMovies") != null) {
    favMoviesArr = JSON.parse(localStorage.getItem("favoritMovies"));
}
// add movie to favorites
function addToFav(movie) {
    let exist = false;
    for (let i = 0; i < favMoviesArr.length; i++) {
        if (favMoviesArr[i].title == movie.title) {
            exist = true;
        }
    }
    if (exist == false) {
        favMoviesArr.push(movie);
    }
    localStorage.setItem("favoritMovies", JSON.stringify(favMoviesArr));
}
// delete movie to favorites
function removeFromFav(movie) {
    let index = 0;
    for (let i = 0; i < favMoviesArr.length; i++) {
        if (favMoviesArr[i].title == movie.title) {
            index = i;
        }
    }
    favMoviesArr.splice(index, 1);
    localStorage.setItem("favoritMovies", JSON.stringify(favMoviesArr));
    if (li[5].classList.contains('active')) {
        disFav(favMoviesArr);
    }
}
// dispaly favorite movies list
function disFav(arr) {
    cartoona = ``;
    for (let i = 0; i < arr.length; i++) {
        cartoona += `<div class="col-md-6 col-lg-4 py-3 text-white">
        <div class="poster  rounded-2 position-relative overflow-hidden">
        <img id="poster_path" class="w-100 poster-img rounded-2" src="https://image.tmdb.org/t/p/w500${arr[i].poster_path}" alt="">
        <div class="movie-details position-absolute d-flex flex-column justify-content-center text-black w-100 h-100">
        <h3  id="title" class="py-2">${arr[i].title}</h3>
        <p  id="overview" class="px-2" >${arr[i].overview}</p>
        <h5 id="vote_average" >   Vote Average: <span>${arr[i].vote_average}</span></h5>
        <h5 id="vote_count">   Vote Count: <span>${arr[i].vote_count}</span></h5>
        <p id="release_date">   ${arr[i].release_date}</p>
        <i class="dele-fav fa-solid fa-circle-xmark fs-3"></i>
    </div>
</div>
</div>`;
    }
    document.querySelector('#posters').innerHTML = cartoona;

    let deleteFavButton = document.querySelectorAll('.poster .dele-fav');
    for (let i = 0; i < deleteFavButton.length; i++) {
        deleteFavButton[i].addEventListener('click', function () {
            removeFromFav(arr[i]);
        });
    }
}

//check which movies were marked as favorite
function checkFavList(arr) {
    for (let i = 0; i < favMoviesArr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (favMoviesArr[i].title == arr[j].title) {
                favButton[j].classList.add('active');
            }
        }
    }
}

//Search for movie by name and display the results
let favoriteSection = document.querySelector('#favorites'); //favorite lable from navbar
let searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('keyup', function () {
    let query = searchInput.value;
    let searchResult = [];
    if (favoriteSection.classList.contains('active')) {
        for (let i = 0; i < favMoviesArr.length; i++) {
            if ((favMoviesArr[i].title.toLowerCase()).includes(query.toLowerCase()) == true) {
                searchResult.push(favMoviesArr[i]);
            }
        }
        disFav(searchResult);
    }
    else {
        for (let i = 0; i < finalResult.length; i++) {
            if ((finalResult[i].title.toLowerCase()).includes(query.toLowerCase()) == true) {
                searchResult.push(finalResult[i]);
            }
        }
        dispalyMovies(searchResult);
    }
})

