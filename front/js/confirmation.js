//--------Affichage de l'id de la commande -----------------//

// Récupération de l'url de la page de confirmation
const confirmationPage = window.location.href;
const orderConfirm = new URL(confirmationPage);

// Récupération de l'id de la commande présent dans l'url spécifique
const getResponseId = orderConfirm.searchParams.get("id");
// Injection de l'id dans le DOM
document.querySelector("#orderId").innerText = getResponseId;

// Vidage des données du local storage
localStorage.removeItem("cart");

