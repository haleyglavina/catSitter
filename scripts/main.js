// Get tweets from twitter API
const API_KEY = "bf82ac27-71f5-4aeb-89fe-9862bb7c6717";
const BASIC_URL = "https://api.thecatapi.com/v1/images/search?";

// API CALL
const getCat = (params) => {
  // IMAGE SEARCH
  let url = BASIC_URL + `breed_id=` + params.breedId;
  console.log("Url used in get:", url);

  axios
    .get(url, {
      headers: {
        "x-api-key": API_KEY,
      },
    })
    .then((res) => {
      console.log(res);
      showCat(res.data[0].url);
      showCatInfo(res.data[0].breeds[0]);
    })
    .catch((err) => {
      console.log("Get request err: ", err);
    });
};

// Display cat info on page
let container = document.querySelector(".cat-container");

const showCat = (picture) => {
  container.innerHTML = "";
  let catPic = document.createElement("img");
  catPic.style.width = "300px";
  catPic.src = picture;
  container.appendChild(catPic);
};

const showCatInfo = (catObj) => {
  // Affection Level
  let catAffection = document.createElement("p");
  catAffection.innerText = `Affection Level: ${catObj.affection_level}`;
  container.appendChild(catAffection);

  // Shedding Level
  let catShedding = document.createElement("p");
  catShedding.innerText = `Shedding Level: ${catObj.shedding_level}`;
  container.appendChild(catShedding);

  // Description
  let catDescrip = document.createElement("p");
  catDescrip.innerText = catObj.description;
  container.appendChild(catDescrip);
};

const showCatList = (filtered) => {
  container.innerHTML = "";
  for (let i = 0; i < filtered.length; i++) {
    let catName = document.createElement("p");
    catName.innerText = `Name: ${filtered[i].name}`;
    container.appendChild(catName);
    catName.addEventListener("click", () => {
      console.log("Filtered: ", filtered[i]);
      getCat({ breedId: filtered[i].id });
    });
  }
};

// Form Submission
// get form
let form = document.querySelector("form");

// on submit, read input values
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get values from input elements
  let breed = document.querySelector("#breed");
  console.log("Breed val:", breed.value);

  if (!breed.value) {
    // No breed specified, query based on shedding and affection
    let shedding = document.querySelector("#shedding");
    let sheddingValue = shedding.value;
    console.log(shedding.value);

    let affection = document.querySelector("#affection");
    let affectionValue = affection.value;
    getAll(sheddingValue, affectionValue);

  } else {
    // Breed specified, query for breed
    // Query for desired breed id
    breedId = getOneBreed(breed.value);
    console.log("Returned breedId",breedId);
    /*
    getCat({
      breedId: breedId,
    });
    */
  }
});

// call api using the search parameters
// cat name, id and shedding level
const getAll = (shedding, affection) => {
  let url = "https://api.thecatapi.com/v1/breeds";
  console.log("Url used in get:", url);

  axios
    .get(url, {
      headers: {
        "x-api-key": API_KEY,
      },
    })
    .then((res) => {
      console.log(res.data);
      let breedsArray = res.data;
      breedsArray = breedsArray.filter(
        (value) => value.shedding_level <= shedding
      );
      console.log(breedsArray);
      breedsArray = breedsArray.filter(
        (value) => value.affection_level >= affection
      );
      showCatList(breedsArray);
    })
    .catch((err) => {
      console.log("Get request err: ", err);
    });
};

// Filter out a single cat object from all breeds
const getOneBreed = (catName) => {
    let url = "https://api.thecatapi.com/v1/breeds";
    console.log("Url used in get:", url);
  
    axios
      .get(url, {
        headers: {
          "x-api-key": API_KEY,
        },
      })
      .then((res) => {
        console.log(res.data);
        let breedsArray = res.data;

        breedsArray = breedsArray.filter(
          (value) => value.name === catName
        );

        console.log("Filtered for single cat obj:", breedsArray);
        console.log("Trying to return:",breedsArray[0].id)
        return breedsArray[0].id;
      })
      .then(breedId => {
        getCat({
            breedId: breedId,
        });
      })
      .catch((err) => {
        console.log("Get request err: ", err);
      });
  };