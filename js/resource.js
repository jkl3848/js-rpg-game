class Resources {
  constructor() {
    //Downloads images for use
    this.toLoad = {
      map: "assets/maps/test_map.jpg",
      hero: "assets/characters/hero-walking/knight.png",
    };

    //Holds all images
    this.images = {};

    //Loads images
    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };
      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });
  }
}

const resources = new Resources();
