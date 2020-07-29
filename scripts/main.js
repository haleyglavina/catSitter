// Get tweets from twitter API
const API_KEY = 'bf82ac27-71f5-4aeb-89fe-9862bb7c6717';
const BASIC_URL = 'https://api.thecatapi.com/v1/images/search?';



// API CALL
const getCat = (params) => {

    // IMAGE SEARCH
    let url = BASIC_URL + `breed_id=` + params.breedId;
    console.log("Url used in get:", url);

    axios
        .get(url, {
            headers: {
                'x-api-key': API_KEY
            }
        })
        .then(res => {
            console.log(res);
            showCat(res.data[0].url);
            showCatInfo(res.data[0].breeds[0]);

        })
        .catch(err => {
            console.log("Get request err: ",err);
        });

    
}

// Display cat info on page
let container = document.querySelector('.cat-container');

const showCat = (picture) => {
    container.innerHTML='';
    let catPic = document.createElement('img');
    catPic.style.width = '300px';
    catPic.src = picture;
    container.appendChild(catPic);
}

const showCatInfo = (catObj) => {
    // Description
    let catDescrip = document.createElement('p');
    catDescrip.innerText = catObj.description;
    container.appendChild(catDescrip);

    // Dog friendliness, shedding, affection level

}

// Form Submission
// get form
let form = document.querySelector('form');

// on submit, read input values
form.addEventListener('submit', e => {
    e.preventDefault();

    // Get values from input elements
    let breed = document.querySelector('#breed');
    console.log("Breed val:",breed.value);
    /*
    let shedding = document.querySelector('#shedding');
    let affection = document.querySelector('#affection');
    let dogFriendly = document.querySelector('#dogFriendly');

    console.log(shedding.value);
    console.log(affection.value);
    console.log(dogFriendly.value);
    */

    getCat({
        breedId: breed.value
    })
})

// call api using the search parameters