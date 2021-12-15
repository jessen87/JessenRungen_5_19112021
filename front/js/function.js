/**
 * Affichage dans le DOM des produits du panier
 * @param { String } data (récupération des informations des articles)
 * @param { String } color (choix de la couleur)
 * @param { number } quantity (nombre du même article)
 * @return { Promise } productArticle (produit à insérer dans le DOM)
 */

function displayItem(data, color, quantity) {

    // Création de l'élément "article" contenant le data-id
    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute('data-id', data._id);
    productArticle.setAttribute('data-color', color);

    // Création d'un élément enfant "div" pour l'image
    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    // Insertion de l'image et texte alternatif
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = data.imageUrl;
    productImg.alt = data.altTxt;

    // Création d'un élément enfant "div" pour les informations de l'objet
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    // Création d'un élément enfant "div" pour nom/couleur/prix
    let productItemContentTitlePrice = document.createElement("div");
    productItemContent.appendChild(productItemContentTitlePrice);
    productItemContentTitlePrice.className = "cart__item__content__titlePrice";

    // Affichage du nom du produit
    let productTitle = document.createElement("h2");
    productItemContentTitlePrice.appendChild(productTitle);
    productTitle.innerHTML = data.name;

    // Affichage du choix de la couleur du produit
    let productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = color;
    productColor.style.fontSize = "18px";

    // Affichage du prix du produit
    let productPrice = document.createElement("p");
    productItemContentTitlePrice.appendChild(productPrice);
    let price = data.price * quantity;
    productPrice.innerHTML = price + " €";
    console.log(productPrice);

    // Création élément enfant pour quantité/suppression
    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    // Création élément enfant pour la quantité
    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

    // Affichage de la quantité choisie
    let productQte = document.createElement("p");
    productItemContentSettingsQuantity.appendChild(productQte);
    productQte.innerHTML = "Qté : ";

    // Création des options pour le choix de la quantité affichée
    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = quantity;
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");
    productQuantity.setAttribute("name", "itemQuantity");

    // Création d'une "div" pour la possibilité de suppression
    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    // Céation de l'élément de suppression d'un produit
    let productSupprimer = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupprimer);
    productSupprimer.className = "deleteItem";
    productSupprimer.innerHTML = "Supprimer";

    return productArticle;
};

