const loader = document.getElementById("loader");
const imageContainer = document.getElementById("image-container");

let initCnt = 5;
let nextCnt = 20;
let photos = [];
let loadedImageCnt = 0;
let totalImageCnt = 0;
let loadedAll = false;
let initialLoading = true;

const WINDOW_INNER_HEIGHT = window.innerHeight;
const API_KEY = "AZv9lIul98dn7Acmbf5FQUWoU9opB0OWVdkkkUJdzeQ";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${initCnt}`;

function showLoader() {
  loader.hidden = false;
}

async function loadPhotosFromApi() {
  try {
    const res = await fetch(apiUrl);
    photos = await res.json();
  } catch (err) {
    alert(err);
  }
}

function createAnchor(photo) {
  const anchor = document.createElement("a");
  setAttributes(anchor, {
    href: photo.links.html,
    target: "_blank",
  });
  return anchor;
}

function createImg(photo) {
  const img = document.createElement("img");
  setAttributes(img, {
    src: photo.urls.regular,
    alt: photo.alt_description,
    title: photo.alt_description,
  });
  return img;
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function increaseLoadedImageCnt() {
  loadedImageCnt++;
}

function isLoadedAll() {
  return loadedImageCnt == totalImageCnt ? true : false;
}

function updateLoadedAll() {
  loadedAll = loadedAll ? false : true;
}

function resetLoadedImageCnt() {
  loadedImageCnt = 0;
}

function updatePropsIfLoadedAll() {
  increaseLoadedImageCnt();

  if (isLoadedAll()) {
    updateLoadedAll();
    resetLoadedImageCnt();
  }
}

function appendElements(img, anchor) {
  anchor.appendChild(img);
  imageContainer.appendChild(anchor);
}

function renderPhotos() {
  totalImageCnt = photos.length;

  photos.forEach((photo) => {
    const anchor = createAnchor(photo);
    const img = createImg(photo);
    img.addEventListener("load", updatePropsIfLoadedAll);
    appendElements(img, anchor);
  });
}

function updateApiUrlWithNextCnt() {
  apiUrl = apiUrl.replace(`count=${initCnt}`, `count=${nextCnt}`);
}

function updateInitialLoading(initialLoading) {
  initialLoading = initialLoading;
}

function hideLoader() {
  loader.hidden = true;
}

async function displayPhotos() {
  showLoader();
  await loadPhotosFromApi();
  renderPhotos();
  if (initialLoading) {
    updateApiUrlWithNextCnt();
    updateInitialLoading(false);
  }
  hideLoader();
}

function isReadyForNextLoading() {
  return WINDOW_INNER_HEIGHT + window.scrollY >= document.body.offsetHeight - 500 && loadedAll;
}

window.addEventListener("scroll", () => {
  if (isReadyForNextLoading()) {
    updateLoadedAll();
    displayPhotos();
  }
});
displayPhotos();
