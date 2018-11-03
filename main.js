var fotoArray = [];
var addToAblumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');
var fotoCardSection = document.querySelector('.foto-card-section')

addToAblumBtn.addEventListener('click', createNewFoto);
favoritesBtn.addEventListener('click', favoriteFilter);
fotoCardSection.addEventListener('click', function(event) {
  favoriteVote(event);
});
window.addEventListener('load', createCardsOnReload);


function clearInputs() {
  title.value = '';
  caption.value = '';
}

function createCards(foto) {
  fotoCardSection.insertAdjacentHTML('afterbegin', 
    `<article data-id=${foto.id}>
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
}

function createNewFoto(event) {
  event.preventDefault();
  var userFoto = URL.createObjectURL(document.getElementById('foto-upload-input').files[0]);
  var foto = new Foto(title.value, caption.value, userFoto);
  fotoArray.unshift(foto);
  foto.saveToStorage(fotoArray);
  createCards(foto);
}

funtion favoriteFilter() {
  var favoriteArray = fotoArray.map(function(foto){
    foto.favorite;
  })
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
  } else if (event.target.classList.contains('favorite-btn')) {
    favoriteUpdateCall(index);
    event.target.classList.add('favorite')
  };
}


function findIndexNumber(fotoId) {
 for (var i = 0; i < fotoArray.length; i++) {
    if (fotoArray[i].id === fotoId) {
      return i;
    };
  }
};











