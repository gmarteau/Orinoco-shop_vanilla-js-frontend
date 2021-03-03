const apiUrl = "http://localhost:3000/api/teddies";

/* Construction de la page produit
********************************************/

// Récupère l'objet spécifique correspondant à l"ID du produit donné en paramètre en effectuant une requête de type "apiUrl/productId"
const getSpecificTeddy = ($pageId) => {
    const specificTeddy = new Promise((resolve) => {
        let requestSpecificTeddy = new XMLHttpRequest();
        requestSpecificTeddy.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(JSON.parse(this.responseText));
                console.log("Connection with API OK");
            }
            else {
                console.log("Connection with API failed");
            }
        };
        requestSpecificTeddy.open("GET", apiUrl + "/" + $pageId);
        requestSpecificTeddy.send();
    });
    return specificTeddy;
};


// Remplit le DOM de la page de fiche produit avec les infos récupérées dans l'API
const displayProductSheet = ($teddyObject) => {
    const productSheet = document.querySelector("#productSheet");
    const pageTitle = document.querySelector("title");
    const titleGeneral = " | Orinoteddies par Orinoco";
    const colorSelect = document.querySelector("#teddyColor");
    const colorOptionTemplate = document.querySelector("#colorOption");
    pageTitle.innerHTML = $teddyObject.name + titleGeneral;
    productSheet.querySelector(".product__pic__img").setAttribute("src", $teddyObject.imageUrl);
    productSheet.querySelector(".product__pic__img").setAttribute("alt", "Peluche " + $teddyObject.name);
    productSheet.querySelector(".product__txt__name").innerHTML = $teddyObject.name;
    let price = $teddyObject.price / 100;
    productSheet.querySelector(".product__txt__price").innerHTML = price + "€";
    productSheet.querySelector(".product__txt__description").innerHTML = $teddyObject.description;
    let colorList = $teddyObject.colors;
    console.log(colorList);
    colorList.forEach((color) => {
        let clone = document.importNode(colorOptionTemplate.content, true);
        clone.querySelector("option").setAttribute("value", color);
        clone.querySelector("option").innerHTML = color;
        colorSelect.appendChild(clone);
    });
};

// Retourne l'ID du produit présent dans l'URL de la page
const getProductIdFromPageUrl = () => {
    let currentPageUrl = window.location.search;
    let searchPageUrl = new URLSearchParams(currentPageUrl);
    let pageId = searchPageUrl.get("id");
    //console.log(pageId);
    return pageId;
};

// Regarde l'ID du produit présent dans l'URL de la page à afficher, puis appelle getSpecificTeddy en lui passant cet ID
// Appelle ensuite displayProdyuctSheet en lui passant l'objet récupéré par getSpecificTeddy pour construire la page
async function createProductPage() {
    let pageId = getProductIdFromPageUrl();
    let teddyCorrespondingToPageId = await getSpecificTeddy(pageId);
    displayProductSheet(teddyCorrespondingToPageId);    
};

createProductPage();


/* Ajout d'un item au panier
****************************************************/

// Classe à partir duquel seront créés les objets à envoyer au localStorage
class Product {
    constructor(name, imgUrl, quantity, totalPrice, productId) {
        this.name = name;
        this.imgUrl = imgUrl;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.productId = productId;
    };
};

const addProductToCart = (event) => {
    event.preventDefault();
    let productName = document.querySelector(".product__txt__name").textContent;
    let productImgUrl = document.querySelector(".product__pic__img").getAttribute("src");
    let productPriceString = document.querySelector(".product__txt__price").textContent;
    let productPrice = parseInt(productPriceString, 10);
    let productQuantityString = document.querySelector("#teddyQuantity").value;
    let productQuantity = parseInt(productQuantityString, 10);
    let totalPrice = productPrice * productQuantity;
    let productId = getProductIdFromPageUrl();
    let productToAddToCart = new Product(
        productName,
        productImgUrl,
        productQuantity,
        totalPrice,
        productId
    );
    //console.log(productToAddToCart);
    localStorageList.push(JSON.stringify(productToAddToCart));
    //console.log(localStorageList);
    localStorage.setItem("productsInCart", JSON.stringify(localStorageList));
    console.log(localStorage);
};

let localStorageList = localStorage.getItem("productsInCart");
const addToCartButton = document.querySelector("#addToCart");
addToCartButton.addEventListener("click", addProductToCart);

// localStorage.clear();
// console.log(localStorage);