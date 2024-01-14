const loadImage = (src, onLoad, onError) => {
  const img = new window.Image();
  img.src = src;
  img.onload = () => onLoad(img); // Pass the loaded image object
  img.onerror = onError;
};

export default loadImage;