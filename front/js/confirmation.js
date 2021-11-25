// Obtenir l'identifiant de la commande avec l'URL
function idRecuperation() {
	let url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);
	if (searchParams.has("id")) {
		let id = searchParams.get("id");
		return id;
	} else {
		console.log("Error, no order Id found");
	}
}
window.addEventListener("load", () => {
	const orderId = document.getElementById("orderId");
	orderId.innerText = idRecuperation();
});
