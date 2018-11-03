var fotoArray = [];
var addToAblumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');
var fotoCardSection = document.querySelector('.foto-card-section')

addToAblumBtn.addEventListener('click', createNewFoto);
fotoCardSection.addEventListener('click', function(event) {
  favorite(event);
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
      <div class="foto" style="background-image: url(${foto.file})" "background-size: contain"></div>
      <p>${foto.caption}</p>
      <footer>
        <button class="delete-btn"></button>
        <button class="favorite-btn"></button>
      </footer>
    </article>`);
  clearInputs(); 
} 

function createCardsOnReload() {
  if (localStorage.length !== 0) {
    var storedArray = localStorage.getItem("array");
    fotoArray = JSON.parse(storedArray);
    fotoArray.reverse();
    fotoArray.forEach(function(foto){
      createCards(foto);
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

function favorite(event) {
  if (event.target.classList.contains('favorite-btn')) {
    var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
    console.log(fotoArray[index]);
    fotoArray[index].updateFavorite();
    fotoArray.splice(index, 1, fotoArray[index]);
    fotoArray[index].saveToStorage;
  };
}

function findIndexNumber(fotoId) {
 for (var i = 0; i < fotoArray.length; i++) {
    if (fotoArray[i].id === fotoId) {
      return i;
    };
  }
};











