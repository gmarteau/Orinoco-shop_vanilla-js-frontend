/* Affichage du panier
***********************************************************/

const cartItemTemplate = document.querySelector("#cartItem");
const cartList = document.querySelector("#cartList");
const cartIsEmpty = document.querySelector("#cartIsEmpty");

const createCartFromLocalStorage = ($productsList) => {
    $productsList.forEach((product) => {
        let productObject = JSON.parse(product);
        let clone = document.importNode(cartItemTemplate.content, true);
        clone.querySelector(".cart__item__pic__img").setAttribute("src", productObject.imgUrl);
        clone.querySelector(".cart__item__pic__img").setAttribute("alt", "Peluche " + productObject.name);
        clone.querySelector(".cart__item__txt__name").innerHTML = productObject.name;
        clone.querySelector(".cart__item__txt__quantity").innerHTML = "x" + productObject.quantity;
        clone.querySelector(".cart__item__price").innerHTML = productObject.totalPrice + "€";
        clone.querySelector(".btn--cross").setAttribute("id", productObject.productId);
        cartList.appendChild(clone);
    });
};

const calculateTotalPrice = () => {
    const totalPriceHTML = document.querySelector(".cart__totalPrice");
    const itemPrices = document.querySelectorAll(".cart__item__price");
    let pricesAsNumbers = [];
    itemPrices.forEach((price) => {
        let priceString = price.textContent;
        let priceNumber = parseInt(priceString, 10);
        pricesAsNumbers.push(priceNumber);
    });
    let totalPrice = pricesAsNumbers.reduce((a, b)=> a + b,0);
    //console.log(totalPrice);
    totalPriceHTML.innerHTML = "Total: " + totalPrice + "€"
};

const checkIfCartIsEmpty = () => {
    let productsListString = localStorage.getItem("productsInCart");
    if (productsListString == null) {
        cartIsEmpty.textContent = "Votre panier est vide.";
    }
    else {
        let productsList = JSON.parse(productsListString);
        if (productsList.length == 0) {
            cartIsEmpty.textContent = "Votre panier est vide.";
        }
        else {
            createCartFromLocalStorage(productsList);
            calculateTotalPrice();
        }
    }
};

checkIfCartIsEmpty();

// Récupère la liste des items dans le panier depuis le localStorage, puis en regarde la longueur
// Si le panier est vide, n'affiche pas l'icone, sinon l'affiche en lui indiquant le nombre d'éléments dans la liste, qui correspond au nombre d'articles dans le panier
const displayCartSizeIconInNav = () => {
    const cartSizeIconInNav = document.querySelector("#cartSizeIconInNav");
    let productsInCart = localStorage.getItem("productsInCart");
    let productsInCartList = [];
    if (productsInCart !== null) {
        productsInCartList = JSON.parse(productsInCart);
    }
    if (productsInCartList.length == 0) {
        cartSizeIconInNav.hidden = true;
    }
    else {
        cartSizeIconInNav.textContent = productsInCartList.length;
        cartSizeIconInNav.hidden = false;
    }
};

displayCartSizeIconInNav();

const removeItemButtons = document.querySelectorAll(".btn--cross");

// Chaque bouton permettant de supprimer un item a pour id l'id de l'item, donc si un bouton est cliqué, on compare son id aux ids des objets contenus dans le localStorage,
// et on supprime du localStorage l'objet correspondant avant de recharger la page qui ne contient désormais plus l'item
Array.from(removeItemButtons).forEach((button) => {
    button.addEventListener("click", function () {
        let itemsInStorageString = localStorage.getItem("productsInCart");
        let itemsInStorage = JSON.parse(itemsInStorageString);
        itemsInStorage.forEach((item) => {
            let itemObject = JSON.parse(item);
            let itemIndex = itemsInStorage.indexOf(item);
            if (itemObject.productId == button.id) {
                itemsInStorage.splice(itemIndex, 1);
                localStorage.setItem("productsInCart", JSON.stringify(itemsInStorage));
                //console.log(localStorage);
                document.location.reload();
            };
        });
        displayCartSizeIconInNav();    
    });
});


/* Envoi de la commande au serveur
***********************************************************/

const apiUrl = "http://localhost:3000/api/teddies";
const sendOrderButton = document.querySelector("#placeOrder");

// Récupère les données saisies par l'utilisateur dans les champs du formulaire, puis les regroupe dans un objet "contact" qui est retourné
const createContact = () => {
    let firstName = document.querySelector("#firstName").value;
    let lastName = document.querySelector("#lastName").value;
    let address = document.querySelector("#address").value;
    let city = document.querySelector("#city").value;
    let email = document.querySelector("#email").value;
    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    };
    return contact;
}

// Récupère les IDs des produits du panier en allant les chercher dans les objets présents dans le localStorage
const createProductsIDsArray = () => {
    let productsListString = localStorage.getItem("productsInCart");
    //console.log(productsListString);
    let productsList = JSON.parse(productsListString);
    //console.log(productsList);
    let productsIDs = [];
    productsList.forEach((product) => {
        let productObject = JSON.parse(product);
        productsIDs.push(productObject.productId);
        //console.log(productObject.productId);
    })
    //console.log(productsIDs);
    return productsIDs;
}

// Appelle l'api avec le méthode POST et en retourne la réponse
const callApiWithPOSTMethod = ($JSONToSend) => {
    const apiResponse = new Promise((resolve) => {
        let postRequest = new XMLHttpRequest();
        postRequest.open("POST", apiUrl + "/order");
        postRequest.setRequestHeader("Content-Type", "application/json");
        postRequest.setRequestHeader("Accept", "application/json");
        postRequest.send($JSONToSend);
        postRequest.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                resolve(JSON.parse(this.responseText));
                console.log("Connection with API OK");
            }
            else {
                console.log("Connection with API failed");
            }
        };
    });
    //console.log(apiResponse);
    return apiResponse;
};


// Envoie les infos relatives à la commande au serveur et récupère sa réponse qui est ensuite ajoutée au localStorage à la clé "lastOrder",
// puis redirige vers la page de confirmation de commande
async function sendOrder(event) {
    event.preventDefault();
    let contact = createContact();
    //console.log(contact);
    let productsIDs = createProductsIDsArray();
    //console.log(productsIDs);
    let order = {
        contact: contact,
        products: productsIDs
    }
    console.log(JSON.stringify(order));
    let responseFromApi = await callApiWithPOSTMethod(JSON.stringify(order));
    console.log(responseFromApi);
    localStorage.setItem("lastOrderContact", JSON.stringify(responseFromApi.contact));
    localStorage.setItem("lastOrderId", JSON.stringify(responseFromApi.orderId));
    console.log(localStorage);
    window.location.replace("../pages/confirmation.html");
};

// Appelle sendOrder lorsque l'utilisateur clique sur "Commander"
sendOrderButton.addEventListener("click", sendOrder);

const formInputs = document.querySelectorAll("input");

const checkInputValidity = () => {
    const lettersOnly = /^[A-Za-z]+$/;
    const lettersAndNumbers = /[\w ]/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    formInputs.forEach((input) => {
        if (input.id == "firstName" || input.id == "lastName" || input.id == "city") {
            let testInput = lettersOnly.test(input.value);
            if (testInput == true) {
                input.style.border = "solid 2px red";
            }
            else {
                input.style.border = "solid 2px green";
            }
        }
        else if (input.id == "address") {
            let testInput = lettersAndNumbers.test(input.value);
            if (testInput == true) {
                input.style.border = "solid 2px red";
            }
            else {
                input.style.border = "solid 2px green";
            }
        } else if (input.id == "email") {
            let testInput = emailRegex.test(input.value);
            if (testInput == true) {
                input.style.border = "solid 2px red";
            }
            else {
                input.style.border = "solid 2px green";
            }
        }
    });
};

Array.from(formInputs).forEach((input) => {
    input.addEventListener("change", checkInputValidity);
});