/* Affichage du panier
***********************************************************/

const cartItemTemplate = document.querySelector("#cartItem");
const cartList = document.querySelector("#cartList");
const cartIsEmpty = document.querySelector("#cartIsEmpty");

// Pour chaque produit présent dans la liste dans le localStorage, remplit le template HTML d'élément du panier avec ses infos
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

// Récupère le prix de chaque élément du panier, les additionne et affiche le prix total du panier
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
    totalPriceHTML.innerHTML = "Total: " + totalPrice + "€"
};

// Regarde si l'élément "productsInCart" existe dans le localStorage, si oui et que c'est une liste non vide, appelle createCartFromLocalStorage en lui passant la liste en question,
// puis appelle calculateTotalPrice; si non ou que la liste est vide, affiche un message indiquant que le panier est vide
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
    let productsList = JSON.parse(productsListString);
    let productsIDs = [];
    productsList.forEach((product) => {
        let productObject = JSON.parse(product);
        productsIDs.push(productObject.productId);
    })
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
    return apiResponse;
};


// Envoie les infos relatives à la commande au serveur et récupère sa réponse qui est ensuite ajoutée au localStorage à la clé "lastOrder",
// puis redirige vers la page de confirmation de commande
async function sendOrder() {
    let contact = createContact();
    let productsIDs = createProductsIDsArray();
    let order = {
        contact: contact,
        products: productsIDs
    }
    let responseFromApi = await callApiWithPOSTMethod(JSON.stringify(order));
    localStorage.setItem("lastOrderContact", JSON.stringify(responseFromApi.contact));
    localStorage.setItem("lastOrderId", JSON.stringify(responseFromApi.orderId));
    window.location.replace("../pages/confirmation.html");
};

// On récupère les inputs et les messages d'erreur, qui sont cachés par défaut
const formInputs = document.querySelectorAll("input");
const errorMessages = document.querySelectorAll(".buyingForm__error");
errorMessages.forEach((error) => {
    error.hidden = true;
});

// Pour un input donné, on vérifie sa validité: s'il est invalide, on lui ajoute la classe .error qui ajoute une bordure rouge et on révèle le message d'erreur;
// si l'input est valide, le message est à nouveau caché et la classe .error est retirée, la bordure devient verte (style de input:valid)
const checkSingleInputValidity = ($input) => {
    let inputId = $input.id;
    let inputIdAsSelector = "#" + inputId;
    let errorAfterInput = inputIdAsSelector + " + .buyingForm__error";
    let error = document.querySelector(errorAfterInput);
    if ($input.validity.valid == false) {
        $input.classList.add("error");
        error.hidden = false;
    }
    else {
        $input.classList.remove("error");
        error.hidden = true;
    }
};

// Ajoute un eventListener "change" pour chaque input du document qui appelle la fonction checkSingleInputValidity en lui passant l'input en question
Array.from(formInputs).forEach((input) => {
    input.addEventListener("change", function() {
        checkSingleInputValidity(input);
    });
});

const displayMissingDataAlerts = () => {
    formInputs.forEach((input) => {
        let inputIdAsSelector = "#" + input.id;
        let errorAfterInput = inputIdAsSelector + " + .buyingForm__error";
        let error = document.querySelector(errorAfterInput);
        if (input.validity.valueMissing == true) {
            input.classList.add("error");
            error.hidden = false;
        }
    });
};

// Affiche un message d'alerte indiquant que le panier est vide si l'utilisateur essaie de commander sans porduits dans son panier
const displayTryingToOrderEmptyCartAlert = () => {
    const cannotOrderEmptyCart = document.querySelector("#cannotOrderEmptyCart");
    cannotOrderEmptyCart.style.transform = "scaleY(1)";
    cannotOrderEmptyCart.style.opacity = "1";
    setTimeout(function() {
        cannotOrderEmptyCart.style.transform = "scaleY(0)";
        cannotOrderEmptyCart.style.opacity = "0";
    }, 2000);
};

// Règle de validité appelée en callback avec la méthode array.every() dans checkAllInputsBeforeSubmitting
const isValid = (currentValue) => currentValue.validity.valid == true;

// Vérifie si tous les inputs du document sont valides: si l'un d'entre eux ne l'est pas, bloque l'envoi du formulaire;
// si le panier est vide, bloque l'envoi du formulaire et affiche un message d'alerte;
// si tout est valide, sendOrder est appelée
const checkAllInputsBeforeSubmitting = (event) => {
    event.preventDefault();
    console.log(Array.from(formInputs).every(isValid));
    if (Array.from(formInputs).every(isValid) == false) {
        console.log("Erreurs dans le formulaire");
        displayMissingDataAlerts();
    }
    else if (cartIsEmpty.textContent == "Votre panier est vide.") {
        console.log("Panier vide");
        displayTryingToOrderEmptyCartAlert();
    }
    else {
        console.log("Formulaire OK");
        sendOrder();
    }
};

// Écoute l'événement "submit" qui correspond au clic sur "Commander", et appelle checkAllInputBeforeSubmitting, qui envoie le formulaire au serveur si tous les inputs sont valides
const form = document.querySelector("form");
form.addEventListener("submit", checkAllInputsBeforeSubmitting);