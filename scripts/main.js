// Global constants
const API_KEY = "bf82ac27-71f5-4aeb-89fe-9862bb7c6717";
const BASIC_URL = "https://api.thecatapi.com/v1/images/search?";

//=================================//
//      Display query results      //
//=================================//
let container = document.querySelector(".cat-container");

// Display picture of a cat
const showCat = (picture) => {
  container.innerHTML = "";
  let catPic = document.createElement("img");
  catPic.classList.add("cat-container__pic");
  catPic.style.width = "300px";
  catPic.src = picture;
  container.appendChild(catPic);
};

// Display cat text info
const showCatInfo = (catObj) => {
  container.style.display = "flex";
  // Text container
  let infoContainer = document.createElement("div");
  infoContainer.classList.add('info');
  container.appendChild(infoContainer);

  // Breed name
  let catName = document.createElement("h1");
  catName.innerText = `${catObj.name}`;
  catName.classList.add('info__name');
  infoContainer.appendChild(catName);

  // Affection Level
  let catAffection = document.createElement("p");
  catAffection.innerText = `Affection Level: ${catObj.affection_level}`;
  catAffection.classList.add('info__stats');
  infoContainer.appendChild(catAffection);

  // Shedding Level
  let catShedding = document.createElement("p");
  catShedding.innerText = `Shedding Level: ${catObj.shedding_level}`;
  catShedding.classList.add('info__stats');
  infoContainer.appendChild(catShedding);

  // Description
  let catDescrip = document.createElement("p");
  catDescrip.innerText = catObj.description;
  catDescrip.classList.add('info__p');
  infoContainer.appendChild(catDescrip);
};

// Display all cat breed names that met filtering criteria
const showCatList = (filtered) => {
  container.innerHTML = "";
  container.style.display = "inline-block";

  // Create title in DOM
  let containerTitle = document.createElement("h1");
  containerTitle.classList.add('cat-container__title');
  containerTitle.innerText = 'Select a breed:';
  container.appendChild(containerTitle);

  // Create breed names in DOM
  for (let i = 0; i < filtered.length; i++) {
    let catName = document.createElement("p");
    catName.innerText = `${filtered[i].name}`;
    catName.classList.add('cat-container__name');
    container.appendChild(catName);
    catName.addEventListener("click", () => {
      getCat({ breedId: filtered[i].id });
    });
  }
};

//=================================//
//         Form Submission         //
//=================================//
let form = document.querySelector("form");

// On submit, read form input values and determine appropriate query
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get values from input elements
  let breed = document.querySelector("#breed");
  console.log("Breed val:", breed.value);

  if (!breed.value) {
    // No breed specified, query based on shedding and affection
    let shedding = document.querySelector("#shedding");
    let sheddingValue = shedding.value || 5;

    let affection = document.querySelector("#affection");
    let affectionValue = affection.value || 1;
    getAll(sheddingValue, affectionValue);

  } else {
    // Breed specified, query for breed
    breedId = getOneBreed(breed.value);
    console.log("Returned breedId",breedId);
  }
});

//=================================//
//            API calls            //
//=================================//

// Get specific breed information
const getCat = (params) => {
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

// Get all breeds that satisfy shedding and affection criteria
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
      let breedsArray = res.data;
      breedsArray = breedsArray.filter(
        (value) => value.shedding_level <= shedding
      );
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
// based on selected 
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