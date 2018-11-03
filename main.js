var fotoArray = [];
var addToAblumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');
var fotoCardSection = document.querySelector('.foto-card-section')

addToAblumBtn.addEventListener('click', createNewFoto);
favoritesBtn.addEventListener('click', event => {
    favoriteFilter(event)
  });
fotoCardSection.addEventListener('click', event => {
    favoriteVote(event);
  });
fotoCardSection.addEventListener('click', event =>{
    deleteCard(event)
  });
window.addEventListener('load', createCardsOnReload);


function clearInputs() {
  title.value = '';
  caption.value = '';
}

function createCards(foto) {
  fotoCardSection.insertAdjacentHTML('afterbegin', 
    `<article class="foto-card" data-id=${foto.id}>
      <h2>${foto.title}</h2>
      <div class="foto" style="background-image: url(${foto.file}); background-size: contain; background-repeat: no-repeat;"></div>
      <p>${foto.caption}</p>
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
    fotoArray = [];
    parsedArray.reverse()
    parsedArray.forEach(function(foto){
      createCards(foto);
      var foto = new Foto(foto.title, foto.caption, foto.file, foto.favorite, foto.id);
      fotoArray.push(foto);
    })
    fotoArray.reverse();
  } 
  favoriteCountUpdate();
}

function createNewFoto(event) {
  event.preventDefault();
  var userFoto = URL.createObjectURL(document.getElementById('foto-upload-input').files[0]);
  var foto = new Foto(title.value, caption.value, userFoto);
  fotoArray.unshift(foto);
  foto.saveToStorage(fotoArray);
  createCards(foto);
}

function deleteCard(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  var card = event.target.parentElement.parentElement;
  console.log(card);
  if (event.target.classList.contains('delete-btn')) {
    fotoArray[index].deleteFromStorage(fotoArray, index);
    card.remove();
  }
}

function favoriteArrayCreate() {
  var favoriteArray = fotoArray.filter(function(foto) {
    if(foto.favorite === true){
      return foto;
    };    
  });
  return favoriteArray;
}

function favoriteCountUpdate() {
  var favoriteArray = favoriteArrayCreate();
  document.querySelector('.favorite-number').innerText = favoriteArray.length;
}

function favoriteFilter(event) {
  event.preventDefault();
  var favoriteArray = favoriteArrayCreate();
  favoriteArray.reverse();
  removeCards();
  favoriteArray.forEach(function(foto) {
    createCards(foto);
  });
}

function favoriteUpdateCall(index){
  fotoArray[index].updateFavorite();
  fotoArray.splice(index, 1, fotoArray[index]);
  fotoArray[index].saveToStorage(fotoArray);
}

function favoriteVote(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  if (event.target.classList.contains('favorite-btn') && event.target.classList.contains('favorite')) {
    favoriteUpdateCall(index);
    event.target.classList.remove('favorite');
    favoriteCountUpdate();
  } else if (event.target.classList.contains('favorite-btn')) {
    favoriteUpdateCall(index);
    event.target.classList.add('favorite')
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

function removeCards() {
  var cards = document.querySelectorAll('.foto-card');
  cards.forEach(function(card){
    card.remove();
  });
}









