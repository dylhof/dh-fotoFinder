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

  deleteFromStorage(arr, index) {
    localStorage.removeItem("array");
    arr.splice(index, 1);
    var fotoArrayString = JSON.stringify(arr);
    localStorage.setItem("array", fotoArrayString);
  }

  updateFavorite(foto) {
    this.favorite = !this.favorite;
    
  }

  updateSelf(newText, type) {
    this[type] = newText;
  }
}