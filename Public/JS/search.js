let allProducts = [];

async function loadProducts() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('keyword');
        const isAccessoryPage = window.location.pathname.includes('phukien');
        
        let url = `/product/search?type=${isAccessoryPage ? 'accessory' : 'car'}`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
        
        const response = await fetch(url);
        allProducts = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    
    if (allProducts.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #888; width: 100%;"><h3>Không tìm thấy sản phẩm nào</h3></div>';
        return;
    }
    
    const isAccessoryPage = window.location.pathname.includes('phukien');
    const detailUrl = isAccessoryPage ? '/chitietphukien' : '/chitietsanpham';
    
    grid.innerHTML = allProducts.map(product => `
        <div class="product-card" onclick="window.location.href='${detailUrl}?id=${product.id}'">
            <img src="${product.imageUrl || '/Public/images/no-image-found.jpg'}" alt="${product.name}" onerror="this.src='/Public/images/no-image-found.jpg'">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            ${!isAccessoryPage ? `
            <div class="car-info">
                <span><i class="fas fa-calendar-alt"></i> ${product.year || 'N/A'}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${product.mileage || 'N/A'}</span>
                <span><i class="fas fa-gas-pump"></i> ${product.fuelType || 'N/A'}</span>
            </div>
            ` : ''}
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProducts);
