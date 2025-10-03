document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    
    async function fetchProducts() {
        try {
            const response = await fetch('/product/');
            const products = await response.json();
            
            const carList = document.getElementById('carList');
            carList.innerHTML = ''; // Xóa dữ liệu mẫu
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" data-id="${product.id}"></td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                    }).format(product.price)}</td>
                    <td>${product.type}</td>
                    <td>${product.status}</td>
                    <td>
                        <button class="btn btn-trans" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-trans" onclick="deleteProduct('${product.id}')">
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
        window.location.href = `/product/edit/${id}`;
    }
    
    // Xoá sản phẩm
    window.deleteProduct = async function (id) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                const response = await fetch(`/product/${id}`, {
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

            const formData = new FormData(createCarForm);
            const fileInput = document.getElementById('uploadImage');

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

            try {
                const response = await fetch('/product/create-car', {
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

            const formData = new FormData(createAccessoryForm);
            const fileInput = document.getElementById('uploadImage');

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

            try {
                const response = await fetch('/product/create-accessory', {
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