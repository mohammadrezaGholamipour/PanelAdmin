const imageLoader = (element) => {
  return new Promise((resolve) => {
    const images = element.value.querySelectorAll("img");
    let loadedImagesCount = 0;
    ////////////////////////////////
    const handleImageLoad = () => {
      loadedImagesCount++;
      if (loadedImagesCount === images.length) {
        resolve(true);
      }
    };
    ////////////////////////////
    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });
  });
};

export default imageLoader;