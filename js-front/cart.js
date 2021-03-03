/* Affichage du panier
***********************************************************/

const createCartFromLocalStorage = () => {
    const cartItemTemplate = document.querySelector("#cartItem");
    const cartList = document.querySelector("#cartList");
    let productsListString = localStorage.getItem("productsInCart");
    let productsList = JSON.parse(productsListString);
    productsList.forEach((product) => {
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

createCartFromLocalStorage();

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
    console.log(totalPrice);
    totalPriceHTML.innerHTML = "Total: " + totalPrice + "€"
};

calculateTotalPrice();


const removeItemButtons = document.querySelectorAll(".btn--cross");
console.log(removeItemButtons);

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
                console.log(localStorage);
                document.location.reload();
            };
        });    
    });
});

// removeItemButtons.addEventListener("click", function () {
//     let buttonId = this.id;
//     console.log(buttonId);
// });

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
const createIDsArray = () => {
    let productsListString = localStorage.getItem("productsInCart");
    //console.log(productsListString);
    let productsList = JSON.parse(productsListString);
    //onsole.log(productsList);
    let IDsArray = [];
    productsList.forEach((product) => {
        let productObject = JSON.parse(product);
        IDsArray.push(productObject.productId);
        //console.log(productObject.productId);
    })
    console.log(IDsArray);
    return IDsArray;
}

// Envoie les infos relatives à la commande au serveur
const sendOrder = (event) => {
    event.preventDefault();
    let contact = createContact();
    //console.log(contact);
    let IDsArray = createIDsArray();
    //console.log(IDsArray);
    let order = {
        contact: contact,
        IDsArray: IDsArray
    }
    console.log(order);
    // let request = new XMLHttpRequest();
    // request.open("POST", apiUrl + "/order");
    // request.send(JSON.stringify(order));
}

// Appelle sendOrder lorsque l'utilisateur clique sur "Commander"
sendOrderButton.addEventListener("click", sendOrder);