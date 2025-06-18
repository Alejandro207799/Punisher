// URL base de la API
const API_BASE_URL = 'https://dummyjson.com';

// Elementos del DOM
const usersList = document.getElementById('users-list');
const productsList = document.getElementById('products-list');
const cartsList = document.getElementById('carts-list');
const addUserForm = document.getElementById('add-user-form');
const addUserMessage = document.getElementById('add-user-message');

const userDetailModal = new bootstrap.Modal(document.getElementById('userDetailModal'));
const userDetailBody = document.getElementById('userDetailBody');
const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
const productDetailBody = document.getElementById('productDetailBody');
const cartDetailModal = new bootstrap.Modal(document.getElementById('cartDetailModal'));
const cartDetailBody = document.getElementById('cartDetailBody');

// Función para mostrar secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección deseada
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Si es la sección de usuarios, cargarlos
    if (sectionId === 'users-section') {
        fetchUsers();
    }
    // Si es la sección de productos, cargarlos
    else if (sectionId === 'products-section') {
        fetchProducts();
    }
    // Si es la sección de carritos, cargarlos
    else if (sectionId === 'carts-section') {
        fetchCarts();
    }
}

// Mostrar loader
function showLoader(element) {
    element.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
}

// Obtener usuarios
async function fetchUsers() {
    showLoader(usersList);
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        displayUsers(data.users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        usersList.innerHTML = '<div class="col-12 text-center text-danger">Error al cargar usuarios.</div>';
    }
}

// Mostrar usuarios
function displayUsers(users) {
    usersList.innerHTML = '';
    if (!users.length) {
        usersList.innerHTML = '<div class="col-12 text-center text-muted">No hay usuarios para mostrar.</div>';
        return;
    }
    
    users.forEach(user => {
        usersList.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <img src="${user.image || 'https://via.placeholder.com/150'}" class="card-img-top p-3" alt="${user.firstName}" style="height: 200px; object-fit: cover; border-radius: 20px;">
                    <div class="card-body">
                        <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                        <p class="card-text">${user.email}</p>
                        <p class="card-text"><small class="text-muted">Teléfono: ${user.phone}</small></p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <button class="btn btn-outline-primary w-100" onclick="fetchUserDetail(${user.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Obtener detalles de un usuario
async function fetchUserDetail(id) {
    userDetailBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    userDetailModal.show();
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (!response.ok) throw new Error('Error al obtener detalle del usuario');
        const user = await response.json();
        
        userDetailBody.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <img src="${user.image || 'https://via.placeholder.com/100'}" class="rounded-circle me-3" alt="${user.firstName}" width="100" height="100">
                <div>
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p class="text-muted mb-1">${user.email}</p>
                    <p class="text-muted mb-0">${user.phone}</p>
                </div>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Nombre de usuario:</strong> ${user.username}</li>
                <li class="list-group-item"><strong>Edad:</strong> ${user.age}</li>
                <li class="list-group-item"><strong>Género:</strong> ${user.gender}</li>
                <li class="list-group-item"><strong>Fecha de nacimiento:</strong> ${user.birthDate}</li>
                <li class="list-group-item"><strong>Dirección:</strong> ${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}</li>
                <li class="list-group-item"><strong>Compañía:</strong> ${user.company.name}</li>
                <li class="list-group-item"><strong>Departamento:</strong> ${user.company.department}</li>
            </ul>
        `;
    } catch (error) {
        console.error('Error al obtener detalle de usuario:', error);
        userDetailBody.innerHTML = '<div class="text-center text-danger">Error al cargar los detalles del usuario.</div>';
    }
}

// Obtener productos
async function fetchProducts() {
    showLoader(productsList);
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Error al obtener productos');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        productsList.innerHTML = '<div class="col-12 text-center text-danger">Error al cargar productos.</div>';
    }
}

// Mostrar productos
function displayProducts(products) {
    productsList.innerHTML = '';
    if (!products.length) {
        productsList.innerHTML = '<div class="col-12 text-center text-muted">No hay productos para mostrar.</div>';
        return;
    }
    
    products.forEach(product => {
        productsList.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.thumbnail}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: cover; border-radius: 20px;">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description.substring(0, 70)}...</p>
                        <p class="card-text"><strong>Precio: $${product.price}</strong></p>
                        <p class="card-text"><small class="text-muted">Rating: ${product.rating}</small></p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <button class="btn btn-outline-primary w-100" onclick="fetchProductDetail(${product.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Obtener detalles de un producto
async function fetchProductDetail(id) {
    productDetailBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    productDetailModal.show();
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Error al obtener detalle del producto');
        const product = await response.json();
        
        productDetailBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.thumbnail}" class="img-fluid rounded mb-3" alt="${product.title}">
                    <div class="d-flex flex-wrap gap-2">
                        ${product.images.slice(0, 4).map(image => `<img src="${image}" class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;" alt="Imagen del producto">`).join('')}
                    </div>
                </div>
                <div class="col-md-6">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Precio:</strong> $${product.price}</li>
                        <li class="list-group-item"><strong>Descuento:</strong> ${product.discountPercentage}%</li>
                        <li class="list-group-item"><strong>Rating:</strong> ${product.rating}</li>
                        <li class="list-group-item"><strong>Stock:</strong> ${product.stock}</li>
                        <li class="list-group-item"><strong>Marca:</strong> ${product.brand}</li>
                        <li class="list-group-item"><strong>Categoría:</strong> ${product.category}</li>
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error al obtener detalle de producto:', error);
        productDetailBody.innerHTML = '<div class="text-center text-danger">Error al cargar los detalles del producto.</div>';
    }
}

// Obtener carritos
async function fetchCarts() {
    showLoader(cartsList);
    try {
        const response = await fetch(`${API_BASE_URL}/carts`);
        if (!response.ok) throw new Error('Error al obtener carritos');
        const data = await response.json();
        displayCarts(data.carts);
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        cartsList.innerHTML = '<div class="col-12 text-center text-danger">Error al cargar carritos.</div>';
    }
}

// Mostrar carritos
function displayCarts(carts) {
    cartsList.innerHTML = '';
    if (!carts.length) {
        cartsList.innerHTML = '<div class="col-12 text-center text-muted">No hay carritos para mostrar.</div>';
        return;
    }
    
    carts.forEach(cart => {
        cartsList.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Carrito #${cart.id}</h5>
                        <p class="card-text"><strong>Usuario ID:</strong> ${cart.userId}</p>
                        <p class="card-text"><strong>Total productos:</strong> ${cart.totalProducts}</p>
                        <p class="card-text"><strong>Total cantidad:</strong> ${cart.totalQuantity}</p>
                        <p class="card-text"><strong>Total:</strong> $${cart.total}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <button class="btn btn-outline-primary w-100" onclick="fetchCartDetail(${cart.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Obtener detalles de un carrito
async function fetchCartDetail(id) {
    cartDetailBody.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    cartDetailModal.show();
    
    try {
        const response = await fetch(`${API_BASE_URL}/carts/${id}`);
        if (!response.ok) throw new Error('Error al obtener detalle del carrito');
        const cart = await response.json();
        
        let productsHtml = '';
        cart.products.forEach(product => {
            productsHtml += `
                <tr>
                    <td>${product.title}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price}</td>
                    <td>$${product.total}</td>
                </tr>
            `;
        });
        
        cartDetailBody.innerHTML = `
            <h5>Carrito #${cart.id}</h5>
            <p><strong>Usuario ID:</strong> ${cart.userId}</p>
            <p><strong>Total productos:</strong> ${cart.totalProducts}</p>
            <p><strong>Total cantidad:</strong> ${cart.totalQuantity}</p>
            <p><strong>Total descuento:</strong> $${cart.discountedTotal}</p>
            <h6 class="mt-4">Productos:</h6>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3">Total</th>
                            <th>$${cart.total}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error al obtener detalle de carrito:', error);
        cartDetailBody.innerHTML = '<div class="text-center text-danger">Error al cargar los detalles del carrito.</div>';
    }
}

// Formulario para agregar usuario
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    
    // Validar campos requeridos
    if (!firstName || !lastName || !email || !password) {
        addUserMessage.textContent = 'Por favor, complete todos los campos requeridos.';
        addUserMessage.className = 'mt-3 text-center text-danger';
        return;
    }
    
    try {
        // Simular creación de usuario (dummyjson no permite crear usuarios en su API pública)
        addUserMessage.textContent = `Usuario ${firstName} ${lastName} creado exitosamente (simulado).`;
        addUserMessage.className = 'mt-3 text-center text-success';
        addUserForm.reset();
    } catch (error) {
        console.error('Error al crear usuario:', error);
        addUserMessage.textContent = 'Error al crear el usuario. Por favor, intente nuevamente.';
        addUserMessage.className = 'mt-3 text-center text-danger';
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar sección de bienvenida por defecto
    showSection('welcome-section');
});