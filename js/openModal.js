document.addEventListener('DOMContentLoaded', () => {
	// Variables
	const openModalCarrito = document.querySelector('.fa-cart-shopping');
	const modal = document.querySelector('#modal');
	const closeModalCarrito = document.querySelector('#close');


	// Event Listeners
	openModalCarrito.addEventListener('click', openCarrito);
	closeModalCarrito.addEventListener('click', closeCarrito);

	// Funciones
	function openCarrito() {
		modal.classList.add('show-modal');
	}

	function closeCarrito() {
		modal.classList.remove('show-modal');
	}
})

