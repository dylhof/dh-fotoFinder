var fotoArray = [];
var addToAblumBtn = document.querySelector('.add-btn');
var favoritesBtn = document.querySelector('.fav-btn');
var uploadBtn = document.querySelector('#foto-upload-input');
var title = document.querySelector('.title');
var caption = document.querySelector('.caption');

addToAblumBtn.addEventListener('click', createNewFoto);
window.addEventListener('load', createCardsOnReload);

function clearInputs() {
  title.value = '';
  caption.value = '';
}

function createCards(foto) {
  var fotoCardSection = document.querySelector('.foto-card-section')
  fotoCardSection.insertAdjacentHTML('afterbegin', 
    `<article data-id=>
      <h2>${foto.title}</h2>
      <div class="foto" style="background-image: url(${foto.file})"></div>
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















