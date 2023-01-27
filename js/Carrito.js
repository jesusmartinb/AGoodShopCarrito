class Carrito {
	#currency;
	#productos;
	#totalPrice;

	constructor(currency, productos) {
		this.#currency = currency;
		this.#productos = productos;
		this.#totalPrice = 0;
	}

	addProducto(nuevoProducto) {
		let mismoProducto = this.#productos.filter(producto => producto.SKU === nuevoProducto.SKU);
		if (mismoProducto.length > 0) {
			const actualizarProducto = {
				...mismoProducto[0],
				amount: mismoProducto[0].amount + 1
			};
			this.productos = [
				...this.#productos.filter(producto => producto.SKU !== nuevoProducto.SKU), actualizarProducto
			];
		} else {
			this.#productos = [...this.#productos, nuevoProducto];
			articulosCarrito = this.#productos;
		}
	}

	actualizarUnidadesProducto(existe, productoSeleccionado) {
		const { SKU } = productoSeleccionado;
		if (existe) {
			const productosCarrito = articulosCarrito.map(productoCarrito => {
				if (productoSeleccionado.SKU === productoCarrito.SKU) {
					productoCarrito.amount++;
					return productoCarrito; // retorna el objeto actualizado
				} else {
					return productoCarrito; // retorna los objetos que no son duplicados
				}
			});
			articulosCarrito = [...productosCarrito];
		} else {
			// Agrega elementos al arreglo de carrito
			articulosCarrito = [...articulosCarrito, productoSeleccionado];
		}
	};

	eliminarProducto(id) {
		// Reiniciar en memoria la cantidad de producto a eliminar a 1
		const articuloAEliminar = articulosCarrito.filter(productoCarrito => productoCarrito.SKU === id);
		articuloAEliminar.map(productoAEliminar => productoAEliminar.amount = 1);

		// Eliminar del arreglo de articulosCarrito por el data-id
		articulosCarrito = articulosCarrito.filter(productoCarrito => productoCarrito.SKU !== id);
	}

	vaciarCarrito() {
		// reseteamos en memoria la cantidad para los productos del carrito
		articulosCarrito.map(articuloCarrito => articuloCarrito.cantidad = 1);

		// reseteamos el arreglo
		articulosCarrito = [];

		localStorage.removeItem('carrito');
	}

	getTotalPrice() {
		return articulosCarrito.reduce((acc, item) => acc + (item.price * item.amount), this.#totalPrice).toFixed(2);
	}

}