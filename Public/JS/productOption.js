document.addEventListener("DOMContentLoaded", async function() {
    document.querySelectorAll('.filter-content').forEach(content => {
        if (!content.style.display || content.style.display === '') {
            content.style.display = "none";
        }
    });
    
    await loadBrands();
    await loadProducts();
    
    document.getElementById('sort').addEventListener('change', sortProducts);
});

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 18;

async function loadBrands() {
    try {
        const res = await fetch('/category/thuong-hieu');
        const brands = await res.json();
        const brandList = document.querySelector('#brand-filter ul');
        const isAccessory = window.location.pathname.includes('phukien');
        const filtered = brands.filter(b => b.idPhanLoaiTH === (isAccessory ? 1 : 0));
        if (brandList) {
            brandList.innerHTML = filtered.map(b => 
                `<li><input type="checkbox" value="${b.id}" onchange="filterProducts()"> ${b.TenTH}</li>`
            ).join('');
        }
        
        if (isAccessory) {
            const catRes = await fetch('/category/loai-phu-kien');
            const categories = await catRes.json();
            const catList = document.querySelector('#category-filter ul');
            if (catList) {
                catList.innerHTML = categories.map(c => 
                    `<li><input type="checkbox" value="${c.id}" onchange="filterProducts()"> ${c.tenLoai}</li>`
                ).join('');
            }
        } else {
            const styleRes = await fetch('/kieu-dang');
            const styles = await styleRes.json();
            const styleList = document.querySelector('#style-filter ul');
            if (styleList) {
                styleList.innerHTML = styles.map(s => 
                    `<li><input type="checkbox" value="${s.tenKieuDang}" onchange="filterProducts()"> ${s.tenKieuDang}</li>`
                ).join('');
            }
            
            const colorRes = await fetch('/mau-xe');
            const colors = await colorRes.json();
            const colorList = document.querySelector('#color-filter ul');
            if (colorList) {
                colorList.innerHTML = colors.map(c => 
                    `<li><input type="checkbox" value="${c.tenMau}" onchange="filterProducts()"> ${c.tenMau}</li>`
                ).join('');
            }
            
            const fuelRes = await fetch('/nguyen-lieu');
            const fuels = await fuelRes.json();
            const fuelList = document.querySelector('#fuel-filter ul');
            if (fuelList) {
                fuelList.innerHTML = fuels.map(f => 
                    `<li><input type="checkbox" value="${f.tenNguyenLieu}" onchange="filterProducts()"> ${f.tenNguyenLieu}</li>`
                ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading brands:', error);
    }
}

async function loadProducts() {
    try {
        const isAccessory = window.location.pathname.includes('phukien');
        const res = await fetch('/product/');
        const products = await res.json();
        allProducts = products.filter(p => isAccessory ? p.type === 'Phụ kiện' : p.type === 'Xe');
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function filterProducts() {
    const brandFilter = document.querySelector('#brand-filter');
    const categoryFilter = document.querySelector('#category-filter');
    const styleFilter = document.querySelector('#style-filter');
    const colorFilter = document.querySelector('#color-filter');
    const fuelFilter = document.querySelector('#fuel-filter');
    
    const checkedBrands = brandFilter ? Array.from(brandFilter.querySelectorAll('input:checked')).map(cb => cb.value) : [];
    const checkedCategories = categoryFilter ? Array.from(categoryFilter.querySelectorAll('input:checked')).map(cb => cb.value) : [];
    const checkedStyles = styleFilter ? Array.from(styleFilter.querySelectorAll('input:checked')).map(cb => cb.value) : [];
    const checkedColors = colorFilter ? Array.from(colorFilter.querySelectorAll('input:checked')).map(cb => cb.value) : [];
    const checkedFuels = fuelFilter ? Array.from(fuelFilter.querySelectorAll('input:checked')).map(cb => cb.value) : [];
    const minPrice = parseFloat(document.getElementById('minPrice')?.value || 0);
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value || Infinity);
    
    let filtered = allProducts;
    if (checkedBrands.length > 0) {
        filtered = filtered.filter(p => checkedBrands.includes(p.brandId));
    }
    if (checkedCategories.length > 0) {
        filtered = filtered.filter(p => checkedCategories.includes(p.categoryId));
    }
    if (checkedStyles.length > 0) {
        filtered = filtered.filter(p => checkedStyles.includes(p.style));
    }
    if (checkedColors.length > 0) {
        filtered = filtered.filter(p => checkedColors.includes(p.color));
    }
    if (checkedFuels.length > 0) {
        filtered = filtered.filter(p => checkedFuels.includes(p.fuelType));
    }
    filtered = filtered.filter(p => {
        const price = parseFloat(p.price.replace(/[^\d]/g, ''));
        return price >= minPrice && price <= maxPrice;
    });
    displayProducts(filtered);
}

function sortProducts() {
    const sortValue = document.getElementById('sort').value;
    let sorted = [...allProducts];
    
    switch(sortValue) {
        case 'az': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'za': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'priceAsc': sorted.sort((a, b) => parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''))); break;
        case 'priceDesc': sorted.sort((a, b) => parseFloat(b.price.replace(/[^\d]/g, '')) - parseFloat(a.price.replace(/[^\d]/g, ''))); break;
        case 'oldest': sorted.sort((a, b) => a.createdAt - b.createdAt); break;
        case 'newest': sorted.sort((a, b) => b.createdAt - a.createdAt); break;
    }
    
    displayProducts(sorted);
}

function displayProducts(products = allProducts) {
    const grid = document.querySelector('.products-grid');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = products.slice(start, end);
    
    grid.innerHTML = paginated.map(p => `
        <div class="product-card" onclick="window.location.href='/chitietxe?id=${p.id}'">
            <img src="${p.imageUrl}" alt="${p.name}" onerror="this.src='/Public/images/placeholder.png'">
            <h3>${p.name}</h3>
            <p class="price">${p.price}</p>
            ${p.year || p.mileage || p.fuelType ? `
                <div class="car-info">
                    ${p.year ? `<span><i class="fas fa-calendar"></i> ${p.year}</span>` : ''}
                    ${p.mileage ? `<span><i class="fas fa-tachometer-alt"></i> ${p.mileage}</span>` : ''}
                    ${p.fuelType ? `<span><i class="fas fa-gas-pump"></i> ${p.fuelType}</span>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
    
    updatePagination(products.length);
}

function updatePagination(total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage >= totalPages;
}

function changePage(direction) {
    currentPage += direction;
    displayProducts();
}

function toggleSection(button) {
    const content = button.parentElement.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    button.innerHTML = content.style.display === "block" ? '<i class="fas fa-angle-up"></i>' : '<i class="fas fa-angle-down"></i>';
}
