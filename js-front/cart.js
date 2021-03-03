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
    console.log(productsListString);
    let productsList = JSON.parse(productsListString);
    console.log(productsList);
    let IDsArray = [];
    productsList.forEach((product) => {
        IDsArray.push(product.productId);
        console.log(product.productId);
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