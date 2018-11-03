class Foto {
  constructor(title, caption, file, favorite, id) {
    this.id = id || 'id' + Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(arr) {
    var fotoArrayString = JSON.stringify(arr);
    localStorage.setItem("array", fotoArrayString);
  }

  deleteFromStorage(arr, id) {
    localStorage.removeItem("array");
    var index = getIndexById(id);
    arr.splice(arr[index], 1);
    var fotoArrayString = JSON.stringify(arr);
    localStorage.setItem("array", fotoArrayString);
  }

  updateFavorite() {
    this.favorite = !this.favorite;
  }

  updateFoto() {

  }
}