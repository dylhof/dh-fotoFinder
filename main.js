var fotoArray = [];
var addToAlbumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');
var fotoCardSection = document.querySelector('.foto-card-section');
var userInputForm = document.querySelector('.user-inputs-form');
var fotoInput = document.getElementById('foto-upload-input');
var userFoto = document.getElementById('foto-upload-input');
var showMoreBtn = document.querySelector('.show-more-btn');
var reader = new FileReader();

function getStuff(field) {
  return document.querySelector(field);
}

addToAlbumBtn.addEventListener('click', createFotoString);
favoritesBtn.addEventListener('click', event => {
    favoriteFilter(event)
  });


fotoCardSection.addEventListener('click', event => {
  if (event.target.classList.contains('favorite-btn')){
    favoriteVote(event);
  } else if (event.target.classList.contains('delete-btn')) {
    deleteCard(event);
  }
})

fotoCardSection.addEventListener('dblclick', updateFotoCard);
userInputForm.addEventListener('input', function() {
  if (title.value !== '' && caption.value !== '' && fotoInput.value !== '')
    enableButton(addToAlbumBtn);
  });
window.addEventListener('load', createCardsOnReload);
document.querySelector('.search-input').addEventListener('keyup', liveSearch);
showMoreBtn.addEventListener('click', showAll)



function disableButton(button) {
    button.disabled = true;
}

function checkFotoArrayLength(foto) {
  if (fotoArray.length <= 5) {
    createCards(foto);
  } else{
    showTen(foto);
  }
}

function clearInputs() {
  title.value = '';
  caption.value = '';
  userFoto.value = '';
}

function createCards(foto) {
  fotoCardSection.insertAdjacentHTML('afterbegin', 
    `<article class="foto-card" data-id=${foto.id}>
      <h2  class="text searchable title" contenteditable="false">${foto.title}</h2>
      <img class="foto" src="${foto.file}">
      <p  class="text searchable caption" contenteditable="false">${foto.caption}</p>
      <footer>
        <button class="delete-btn"></button>
        <button class="favorite-btn"></button>
      </footer>
    </article>`);
  if (foto.favorite) {
    document.querySelector('.favorite-btn').classList.add("favorite")
  }
  clearInputs(); 
} 

function createCardsOnReload() {
  if (localStorage.length !== 0) {
    var storedArray = localStorage.getItem("array");
    var parsedArray = JSON.parse(storedArray);
    parsedArray.forEach(function(foto){
      var foto = new Foto(foto.title, foto.caption, foto.file, foto.favorite, foto.id);
      fotoArray.push(foto);
      checkFotoArrayLength(foto);
    }) 
    document.querySelector('.no-photo-text').remove();
  } 
  favoriteCountUpdate();
}

function createFotoString() {
  if (document.getElementById('foto-upload-input').files[0]) {
    reader.readAsDataURL(document.getElementById('foto-upload-input').files[0]);
    reader.onload = createNewFoto;
  }
}

function createNewFoto(event) {
  event.preventDefault();
  disableButton(addToAlbumBtn);
  var userFoto =  reader.result;
  var foto = new Foto(title.value, caption.value, userFoto);
  fotoArray.push(foto);
  foto.saveToStorage(fotoArray);
  checkFotoArrayLength(foto);
  if (fotoArray.length === 1) { 
    document.querySelector('.no-photo-text').remove();
  } 
}

function deleteCard(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  var card = event.target.parentElement.parentElement;
  fotoArray[index].deleteFromStorage(fotoArray, index);
  card.remove();
  favoriteCountUpdate();
  if (fotoArray.length === 0) {
    fotoCardSection.insertAdjacentHTML('afterbegin',
      '<p class="no-photo-text">Looks like you don\'t have any photos yet! Add them above to start your album!</p>');
  }
  if (fotoArray.length <=5) {
    disableButton(showMoreBtn);
  }
}

function enableButton(button) {
    button.disabled = false;
}

function favoriteArrayCreate() {
  var favoriteArray = fotoArray.filter(function(foto) {
    if(foto.favorite === true){
      return foto;
    };    
  });
  favoriteArray.reverse();
  return favoriteArray;
}

function favoriteCountUpdate() {
  var favoriteArray = favoriteArrayCreate();
  if (favoriteArray.length === 0){
    document.querySelector('.favorite-number').innerText = 0;
  } else {
    document.querySelector('.favorite-number').innerText = favoriteArray.length;
  }
}
  
function favoriteFilter(event) {
  var changeArray = fotoArray.slice(0);
  event.preventDefault();
  if(document.querySelector('.fav-btn').innerText === 'View All') {
    removeCards();
    changeArray.forEach(function(foto) {
      checkFotoArrayLength(foto)
    });
    document.querySelector('.fav-btn').innerHTML = 'View <span class="favorite-number">#</span> Favorites';
    favoriteCountUpdate();
  } else {
    var favoriteArray = favoriteArrayCreate();
    removeCards();
    favoriteArray.reverse();
    favoriteArray.forEach(function(foto) {
      createCards(foto);
    });
    favoriteArray.reverse();
    document.querySelector('.fav-btn').innerText = 'View All';
  };
}

function favoriteUpdateCall(index){
  fotoArray[index].updateFavorite();
  fotoArray.splice(index, 1, fotoArray[index]);
  fotoArray[index].saveToStorage(fotoArray);
}

function favoriteVote(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  if (event.target.classList.contains('favorite')) {
    favoriteUpdateCall(index);
    event.target.classList.remove('favorite');
    favoriteCountUpdate();
  } else {
    favoriteUpdateCall(index);
    event.target.classList.add('favorite');
    favoriteCountUpdate();
  };
}

function findIndexNumber(fotoId) {
 for (var i = 0; i < fotoArray.length; i++) {
    if (fotoArray[i].id === fotoId) {
      return i;
    };
  }
}

function liveSearch() {
  var searchInput = this.value.toLowerCase();
  var shownArray = fotoArray.filter(function(foto) {
   return foto.title.toLowerCase().includes(searchInput) || foto.caption.toLowerCase().includes(searchInput)
  })
  removeCards();
  shownArray.forEach(function(foto) {
    createCards(foto);
  })
}

function removeCards() {
  var cards = document.querySelectorAll('.foto-card');
  cards.forEach(function(card){
    card.remove();
  });
}

function saveTextOnClick(event) {
  updateFoto();    
  setUneditable(); 
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
};

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateFoto();    
    setUneditable(); 
    document.body.removeEventListener('keypress', saveTextOnEnter);
    event.target.removeEventListener('blur', saveTextOnClick);
  }
}; 

function setEditable() {
  event.target.contentEditable = true;
}

function setUneditable() {
  event.target.contentEditable = false;
};

function showAll() {
  if (showMoreBtn.innerText === 'Show More') {
    removeCards();
    fotoArray.forEach(function(foto){
      createCards(foto);
    });
    showMoreBtn.innerText = 'Show Less';
  } else if (showMoreBtn.innerText === 'Show Less') {
    showTen();
    showMoreBtn.innerText = 'Show More';  
  }
}

function showTen(foto) {
  // if (fotoArray.length <= 5) {
  //   createCards(foto);
  // } else {
    enableButton(showMoreBtn);

    // fotoArray.forEach(function(foto, i) {

    // })


    var changeArray = fotoArray.slice(0,);
    console.log('from show 10 funct', changeArray);
    changeArray.reverse();
    var showArray = changeArray.slice(0, 5);
    removeCards();
    showArray.reverse();
    showArray.forEach(function(foto) {
      createCards(foto);
    })
  
}

function updateFoto() {
var index = findIndexNumber(event.target.parentElement.dataset.id);
  if (event.target.classList.contains('title')) {
    fotoArray[index].updateSelf(event.target.innerText, 'title');
  } else {
    fotoArray[index].updateSelf(event.target.innerText, 'caption');
  }
  fotoArray[index].saveToStorage(fotoArray);
}

function updateFotoCard(event) {
 if (event.target.classList.contains('text')) {
  setEditable();
  document.body.addEventListener('keypress', saveTextOnEnter);
  event.target.addEventListener('blur', saveTextOnClick);
 }
}
