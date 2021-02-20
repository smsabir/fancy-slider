const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchField = document.getElementById("search");
const errorMsg = document.getElementById("error-message");
const noImage = document.getElementById('no-image');
const timeInput = document.getElementById('duration');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
// Showing error message and hide create slider.
  if(images.length === 0){
    noImage.innerHTML = `<p id="noImage-msg">No Image Found! Try another search!</p>`;
    galleryHeader.style.display = 'none';
  }
  else{
    // show gallery title
    galleryHeader.style.display = 'flex';
    noImage.innerHTML ='';
    errorMsg.innerText='';
  }
    
  toggleSpinner();
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    
  })

};

var timer
const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => errorMessage())
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  //console.log(sliders.indexOf(img))
  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.remove('added');
    // removing the double clicked image
    sliders.splice(item, 1); 
    alert('Selected Item Removed!');
  }
};


const createSlider = (sliders) => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return 0;
  }
  else{
  
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image area
    imagesArea.style.display = 'none';
    
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0);

    //function for Slide show duration.
    const duration = () =>{
      let showTime = timeInput.value || 1;
      
      //console.log(showTime);
      if(showTime < 0.5){
        alert("You've entered a interval time is less than 0.5 second!\nInterval Time set to 1s by default.");
        return (1000 * 1);
      }
      else{
        return (showTime * 1000);
      }
    }

    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration());
  }
};


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
};

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
};

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  timeInput.value='';
  clearInterval(timer);
  const search = document.getElementById('search');
  toggleSpinner();
  getImages(search.value);
  sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
  createSlider(sliders);
});


// Error message if API doesn't work.
const errorMessage = () =>{
  toggleSpinner();
  errorMsg.innerText = 'Something went wrong! Please try again!';
}

//Enter key Search function
searchField.addEventListener('keypress', function(event){
  if(event.key === 'Enter'){
    event.preventDefault();
    searchBtn.click();
  }

});

// Spinner while loading
const toggleSpinner = () =>{
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle('d-none');
};
