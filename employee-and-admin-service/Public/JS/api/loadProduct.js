document.addEventListener('DOMContentLoaded', function() {
    const prefix = window.location.pathname.startsWith('/admin') ? '/admin' : '/employee';
    loadCategories();
    fetchProducts();
    
    async function loadCategories() {
        try {
            const [brands, categories, styles, colors, fuels] = await Promise.all([
                fetch(prefix + '/category/thuong-hieu').then(r => r.json()),
                fetch(prefix + '/category/loai-phu-kien').then(r => r.json()),
                fetch(prefix + '/kieu-dang').then(r => r.json()),
                fetch(prefix + '/mau-xe').then(r => r.json()),
                fetch(prefix + '/nguyen-lieu').then(r => r.json())
            ]);
            
            // Load brands for car
            const carBrandSelect = document.querySelector('#createCarForm select[name="iDthuongHieu"]');
            if (carBrandSelect) {
                carBrandSelect.innerHTML = brands.filter(b => b.idPhanLoaiTH === 0)
                    .map(b => `<option value="${b.id}">${b.TenTH}</option>`).join('');
            }
            
            // Load brands for accessory
            const accBrandSelect = document.querySelector('#createAccessoryForm select[name="iDthuongHieu"]');
            if (accBrandSelect) {
                accBrandSelect.innerHTML = brands.filter(b => b.idPhanLoaiTH === 1)
                    .map(b => `<option value="${b.id}">${b.TenTH}</option>`).join('');
            }
            
            // Load categories for accessory
            const categorySelect = document.querySelector('#createAccessoryForm select[name="idLoai"]');
            if (categorySelect) {
                categorySelect.innerHTML = categories
                    .map(c => `<option value="${c.id}">${c.tenLoai}</option>`).join('');
            }
            
            // Load styles for car
            const styleSelect = document.querySelector('#createCarForm select[name="kieuDang"]');
            if (styleSelect) {
                styleSelect.innerHTML = styles
                    .map(s => `<option value="${s.id}">${s.tenKieuDang}</option>`).join('');
            }
            
            // Load colors for car
            const colorSelect = document.querySelector('#createCarForm select[name="mauXe"]');
            if (colorSelect) {
                colorSelect.innerHTML = colors
                    .map(c => `<option value="${c.id}">${c.tenMau}</option>`).join('');
            }
            
            // Load fuels for car
            const fuelSelect = document.querySelector('#createCarForm select[name="nguyenLieu"]');
            if (fuelSelect) {
                fuelSelect.innerHTML = fuels
                    .map(f => `<option value="${f.id}">${f.tenNguyenLieu}</option>`).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
    
    async function fetchProducts() {
        try {
            const response = await fetch(prefix + '/product/');
            const products = await response.json();
            
            const carList = document.getElementById('carList');
            carList.innerHTML = ''; // Xóa dữ liệu mẫu
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" data-id="${product.id}"></td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${product.price}</td>
                    <td>${product.type}</td>
                    <td>${product.status}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                carList.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi khi tải danh sách sản phẩm');
        }
    }
    
    // Sửa sản phẩm
    window.editProduct = function(id) {
        console.log('Edit product:', id);
        window.location.href = `${prefix}/product/edit/${id}`;
    }
    
    // Xoá sản phẩm
    window.deleteProduct = async function (id) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                const response = await fetch(`${prefix}/product/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Sản phẩm đã được xóa thành công!');
                    fetchProducts();
                } else {
                    alert('Có lỗi xảy ra khi xóa sản phẩm.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi khi xóa sản phẩm.');
            }
        }
    };
    // Form thêm xe
    const createCarForm = document.getElementById('createCarForm');
    
    if (createCarForm) {
        createCarForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const fileInput = createCarForm.querySelector('input[name="uploadImage"]');

            // Kiểm tra số lượng file
            if (fileInput.files.length > 5) {
                alert('Chỉ được phép upload tối đa 5 ảnh!');
                return;
            }
                
            // Kiểm tra loại file
            for (let file of fileInput.files) {
                if (!file.type.startsWith('image/')) {
                    alert(`File ${file.name} không phải là file ảnh!`);
                    return;
                }
            }

            const formData = new FormData();
            const formElements = createCarForm.elements;
            
            for (let element of formElements) {
                if (element.name && element.name !== 'uploadImage') {
                    if (element.type === 'checkbox') {
                        formData.append(element.name, element.checked ? 'on' : 'off');
                    } else if (element.tagName === 'TEXTAREA') {
                        formData.append(element.name, $('#' + element.id).summernote('code'));
                    } else {
                        formData.append(element.name, element.value);
                    }
                }
            }
            
            for (let file of fileInput.files) {
                formData.append('uploadImage', file);
            }

            try {
                const response = await fetch(prefix + '/product/create-car', {
                    method: 'POST',
                    body: formData 
                });
                
                if (response.ok) {
                    window.alert('Xe đã thêm thành công!');
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    window.alert(errorData.message || 'Có lỗi xảy ra');
                }
            } catch (error) {
                console.error('Lỗi kết nối:', error);
                window.alert('Đã xảy ra lỗi khi thêm xe.');
            }
        });
    }

    // Form thêm phụ kiện
    const createAccessoryForm = document.getElementById('createAccessoryForm');
    
    if (createAccessoryForm) {
        createAccessoryForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const fileInput = createAccessoryForm.querySelector('input[name="uploadImage"]');

            // Kiểm tra số lượng file
            if (fileInput.files.length > 5) {
                alert('Chỉ được phép upload tối đa 5 ảnh!');
                return;
            }
                
            // Kiểm tra loại file
            for (let file of fileInput.files) {
                if (!file.type.startsWith('image/')) {
                    alert(`File ${file.name} không phải là file ảnh!`);
                    return;
                }
            }

            const formData = new FormData();
            const formElements = createAccessoryForm.elements;
            
            for (let element of formElements) {
                if (element.name && element.name !== 'uploadImage') {
                    if (element.type === 'checkbox') {
                        formData.append(element.name, element.checked ? 'on' : 'off');
                    } else if (element.tagName === 'TEXTAREA') {
                        formData.append(element.name, $('#' + element.id).summernote('code'));
                    } else {
                        formData.append(element.name, element.value);
                    }
                }
            }
            
            for (let file of fileInput.files) {
                formData.append('uploadImage', file);
            }

            try {
                const response = await fetch(prefix + '/product/create-accessory', {
                    method: 'POST',
                    body: formData 
                });
                
                if (response.ok) {
                    window.alert('Phụ kiện đã thêm thành công!');
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    window.alert(errorData.message || 'Có lỗi xảy ra');
                }
            } catch (error) {
                console.error('Lỗi kết nối:', error);
                window.alert('Đã xảy ra lỗi khi thêm phụ kiện.');
            }
        });
    }
});