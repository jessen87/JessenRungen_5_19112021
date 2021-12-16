//---------------- Gestion de l'affichage du produit -------------------//

// Récupération de la chaine de requête dans l'URL
const queryString_url_id = window.location.search;
console.log(queryString_url_id);

// Méthode extraction de l'Id par un constructeur
const urlSearchParams = new URLSearchParams(queryString_url_id);
console.log(urlSearchParams);
// Récupération de l'id de l'item dans l'URL
const idItems = urlSearchParams.get("id");
console.log(idItems);

// Positionnement de l'objet dans le DOM
const positionElement = document.querySelector(".item");
console.log(positionElement);


// Récupération d'un article de l'API avec son Id
fetch("http://localhost:3000/api/products/" + idItems)
    .then(function (res) {
        return res.json();
    })

    // Fonction de récupération des informations de l'article
    .then(function (article) {
        displayProduct(article);

    })

    // Fonction affichage d'erreur si rejet de la promise
    .catch((error) => {
        console.log(error, "Fetch failed");
        let items = document.querySelector(".item");
        items.innertHTML = "Produit momentanément indisponible. Veuillez revenir plus tard.";
    });


// Création de la fonction d'affichage des données de l'article
function displayProduct(article) {

    // Affichage de l'image de l'article choisi
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Affichage du nom de l'article choisi
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

    // Affichage du nom dans l'onglet de la page
    let productsName = document.getElementById('titles');
    productsName.innerHTML = article.name;

    // Affiche le prix de l'article choisi
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Affiche la description de l'article choisi
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Sélection du choix de la couleur de l'article
    for (let colors of article.colors) {
        console.log(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    };
}


//------------------------- Gestion du panier --------------------------------//


// Sélection du bouton pour ajouter au panier
const addToCart = document.getElementById("addToCart");
console.log(addToCart);

// Fonction de récupération d'un article déclaré dans le local storage
function getCart() {
    let items = [];
    if (localStorage.getItem("cart") != null) {
        items = JSON.parse(localStorage.getItem("cart"));
    }
    return items;
}
/*--- JSON.parse pour convertir les données au format JSON 
----- qui sont dans le local storage en objet JavaScript ---*/


// Choix de la quantité dans une fonction
function quantityValue() {
    let quantity = document.getElementById("quantity");
    return quantity.value;
}

// Choix de la couleur dans une fonction
function colorValue() {
    let color = document.getElementById("colors");
    return color.value;
}



//Fenêtre de confirmation des options sélectionnées
const confirmationWindow = () => {
    if (window.confirm(`Votre choix de couleur: ${colorValue()} et de quantité: ${quantityValue()} a bien été ajouté à votre panier.`)) {
        
     }
}

/**
 * Fonction d'ajout au panier selon les options avec regroupement des items
 * @param { String } productId (id du produit choisi)
 * @param { String } color (option couleur choisie)
 * @param { number } quantity (nombre d'article du même id et color)
 */
function itemInCart(productId, color, quantity) {
    //if (quantity == 0 || color == 0) {
    if ((color == 0) || ((quantity == null) || (quantity < 1) || (quantity > 100))) {
        window.alert("Veuillez choisir une couleur et une quantité comprise entre min:1 et max:100 pour votre canapé, merci.");
        return;
    }
    let items = getCart();
    if (items.length == 0) {
        items.push({ "productId": productId, "color": color, "quantity": quantity });
        confirmationWindow();

    } else {
        let found = false;
        for (let i = 0; i < items.length; i++) {
            /* Si item avec le même id/couleur déjà présent dans le local storage
        on incrémente juste la quantité */
            if (productId === items[i].productId && color === items[i].color) {
                found = true;
                items[i].quantity += quantity;
                confirmationWindow();
            }
        }
        if (found == false) {
            let item = {
                "productId": productId, "color": color, "quantity": quantity
            };
            // Méthode d'ajout dans le tableau de l'objet avec les options choisies
            items.push(item);
            confirmationWindow();
        }
    }
    // Transformation au format JSON et envoie vers la key du local storage
    localStorage.setItem("cart", JSON.stringify(items));
}


// Ecouter le bouton et envoie dans le panier des options choisies
addToCart.addEventListener("click", () => {
    let quantity = parseInt(quantityValue());  //Convertit la chaîne de caractères et renvoit un entier
    let color = colorValue();
    itemInCart(idItems, color, quantity);
});