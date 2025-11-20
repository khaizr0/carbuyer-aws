const path = require('path');
const fs = require('fs');
const { getDB } = require('../config/db');
const { addCarProduct, getRecentProducts, getAllProducts, deleteProductById, addAccessoryProduct, findProductById, getProductById, getRelatedProducts } = require('../models/ProductModel');
const { uploadProducts, getS3Url } = require('../utils/s3-upload');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, S3_BUCKET } = require('../config/s3');

const IDSP = "";
const upload = uploadProducts.array('uploadImage', 5);

const createCarProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const carData = req.body;
      
      if (req.files && req.files.length > 0) {
        carData.hinhAnh = req.files.map(file => file.key.split('/').pop()).join(' || ');
      } else {
        carData.hinhAnh = '';
      }

      carData.datLich = carData.dangkilaithu === 'on' ? 1 : 0;
      carData.GiaNiemYet = carData.GiaNiemYet ? Number(carData.GiaNiemYet) : 0;

      const missingFields = [];
      if (!carData.tenSP) missingFields.push('Tên sản phẩm');
      if (!carData.iDthuongHieu) missingFields.push('Thương hiệu');
      if (!carData.namSanXuat) missingFields.push('Năm sản xuất');
      if (!carData.GiaNiemYet) missingFields.push('Giá niêm yết');
      if (!carData.soChoNgoi) missingFields.push('Số chỗ ngồi');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Dữ liệu không đầy đủ, thiếu các trường: ${missingFields.join(', ')}` 
        });
      }

      const newProduct = await addCarProduct(carData);

      return res.status(200).json({ 
        message: 'Sản phẩm đã được thêm thành công!',
        product: newProduct 
      });
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      return res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
    }
  });
};

const createAccessoryProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const accessoryData = req.body;

      if (req.files && req.files.length > 0) {
        accessoryData.hinhAnh = req.files.map(file => file.key.split('/').pop()).join(' || ');
      } else {
        accessoryData.hinhAnh = '';
      }
      
      accessoryData.GiaNiemYet = accessoryData.GiaNiemYet ? Number(accessoryData.GiaNiemYet) : 0;

      const missingFields = [];
      if (!accessoryData.tenSP) missingFields.push('Tên sản phẩm');
      if (!accessoryData.iDthuongHieu) missingFields.push('Thương hiệu');
      if (!accessoryData.idLoai) missingFields.push('Loại phụ kiện');
      if (!accessoryData.GiaNiemYet) missingFields.push('Giá');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: `Dữ liệu không đầy đủ, thiếu các trường: ${missingFields.join(', ')}` 
        });
      }

      const newAccessory = await addAccessoryProduct(accessoryData);

      return res.status(200).json({ 
        message: 'Phụ kiện đã được thêm thành công!',
        accessory: newAccessory 
      });
    } catch (error) {
      console.error('Lỗi khi thêm phụ kiện:', error);
      return res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
    }
  });
};

const getRecentProductsController = async (req, res) => {
  try {
    const recentProducts = await getRecentProducts();
    const docClient = getDB();
    
    const fuels = await docClient.send(new (require('@aws-sdk/lib-dynamodb').ScanCommand)({ TableName: 'NguyenLieuXe' }));
    const fuelMap = (fuels.Items || []).reduce((acc, f) => {
      acc[f.id] = f.tenNguyenLieu;
      return acc;
    }, {});
    
    const formattedProducts = recentProducts.map(product => {
      const imageFileName = product.hinhAnh ? product.hinhAnh.split('||')[0].trim() : '';
      const imageUrl = imageFileName ? getS3Url(`Database/Products/${imageFileName}`) : '/Public/images/placeholder.png';
      return {
        id: product.id,
        name: product.tenSP,
        price: new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(product.GiaNiemYet),
        year: product.namSanXuat,
        mileage: (product.soKm || 0).toLocaleString('vi-VN') + ' km',
        fuelType: fuelMap[product.idNguyenLieu] || 'N/A',
        imageUrl: imageUrl
      };
    });
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy sản phẩm' });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await getAllProducts();
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy danh sách sản phẩm' });
  }
};

const deleteProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await deleteProductById(id);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Có lỗi khi xóa sản phẩm.' });
  }
};

const getEditProductPageController = async (req, res) => {
  try {
      const productId = req.params.id;
      global.IDSP = productId;

      const { product, productType } = await findProductById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      }

      const editProductHtml = fs.readFileSync(
          path.join(__dirname, '../views/employee/editProduct.html'),
          'utf8'
      );

      const scriptFillData = `
      <script>
      window.addEventListener('load', async function() {
          await new Promise(r => setTimeout(r, 1000));
          const prefix = window.location.pathname.startsWith('/admin') ? '/admin' : '/employee';
          const productType = '${productType}';
          const product = ${JSON.stringify(product)};

          if (productType === 'XE') {
              let brands, styles, colors, fuels;
              try {
                  const responses = await Promise.all([
                      fetch(prefix + '/category/thuong-hieu', {
                          method: 'GET',
                          credentials: 'same-origin',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      }),
                      fetch(prefix + '/kieu-dang', {
                          method: 'GET', 
                          credentials: 'same-origin',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      }),
                      fetch(prefix + '/mau-xe', {
                          method: 'GET',
                          credentials: 'same-origin', 
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      }),
                      fetch(prefix + '/nguyen-lieu', {
                          method: 'GET',
                          credentials: 'same-origin',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      })
                  ]);
                  
                  // Check if all responses are ok
                  for (let i = 0; i < responses.length; i++) {
                      if (!responses[i].ok) {
                          const errorText = await responses[i].text();
                          console.error(\`API \${i} failed:\`, responses[i].status, errorText);
                          throw new Error(\`API call \${i} failed with status \${responses[i].status}\`);
                      }
                  }
                  
                  [brands, styles, colors, fuels] = await Promise.all(
                      responses.map(r => r.json())
                  );
              } catch (error) {
                  console.error('Error loading data:', error);
                  if (confirm('Không thể tải dữ liệu. Bạn có muốn tải lại trang không?')) {
                      window.location.reload();
                  }
                  return;
              }
              
              document.getElementById('iDthuongHieu').innerHTML = brands.filter(b => b.idPhanLoaiTH === 0)
                  .map(b => \`<option value="\${b.id}">\${b.TenTH}</option>\`).join('');
              
              document.getElementById('idKieuDang').innerHTML = styles.map(s => 
                  \`<option value="\${s.id}">\${s.tenKieuDang}</option>\`
              ).join('');
              
              document.getElementById('idMauXe').innerHTML = colors.map(c => 
                  \`<option value="\${c.id}">\${c.tenMau}</option>\`
              ).join('');
              
              document.getElementById('idNguyenLieu').innerHTML = fuels.map(f => 
                  \`<option value="\${f.id}">\${f.tenNguyenLieu}</option>\`
              ).join('');
              
              document.getElementById('tenSP').value = product.tenSP || '';
              document.getElementById('namSanXuat').value = product.namSanXuat || '';
              document.getElementById('GiaNiemYet').value = product.GiaNiemYet || '';
              document.getElementById('soKm').value = product.soKm || '';
              document.getElementById('soChoNgoi').value = product.soChoNgoi || '';
              document.getElementById('loaiCanSo').value = product.loaiCanSo || '';
              
              setTimeout(() => {
                  document.getElementById('iDthuongHieu').value = product.iDthuongHieu || '';
                  document.getElementById('idNguyenLieu').value = product.idNguyenLieu || '';
                  document.getElementById('idKieuDang').value = product.idKieuDang || '';
                  document.getElementById('idMauXe').value = product.idMauXe || '';
                  document.getElementById('trangThai').value = product.trangThai || '';
                  document.getElementById('dangkilaithu').checked = product.datLich === 1;
              }, 200);
              
              $('#chiTietSP').summernote('code', product.chiTietSP || '');
              
              // Hiển thị ảnh hiện tại
              const images = product.hinhAnh ? product.hinhAnh.split(' || ') : [];
              const container = document.getElementById('currentImages');
              container.innerHTML = '';
              
              for (let i = 0; i < 5; i++) {
                  const div = document.createElement('div');
                  div.style.cssText = 'width: 100px; height: 100px; position: relative;';
                  
                  if (i < images.length) {
                      div.innerHTML = \`<img src="${process.env.S3_PUBLIC_URL}/Database/Products/\${images[i]}" class="img-thumbnail" style="width: 100%; height: 100%; object-fit: cover;">\`;
                  } else {
                      div.innerHTML = '<div class="border rounded d-flex align-items-center justify-content-center" style="width: 100%; height: 100%; background: #f8f9fa;"><i class="fas fa-plus fa-2x text-muted"></i></div>';
                  }
                  
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;';
                  input.onchange = function(e) {
                      if (e.target.files[0]) {
                          window.imageChanges[i] = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                              div.querySelector('img, div').outerHTML = \`<img src="\${ev.target.result}" class="img-thumbnail" style="width: 100%; height: 100%; object-fit: cover;">\`;
                          };
                          reader.readAsDataURL(e.target.files[0]);
                      }
                  };
                  div.appendChild(input);
                  container.appendChild(div);
              }
          } else if (productType === 'PK') {
              let brands, categories;
              try {
                  const responses = await Promise.all([
                      fetch(prefix + '/category/thuong-hieu', {
                          method: 'GET',
                          credentials: 'same-origin',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      }),
                      fetch(prefix + '/category/loai-phu-kien', {
                          method: 'GET',
                          credentials: 'same-origin',
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          }
                      })
                  ]);
                  
                  // Check if all responses are ok
                  for (let i = 0; i < responses.length; i++) {
                      if (!responses[i].ok) {
                          const errorText = await responses[i].text();
                          console.error(\`API \${i} failed:\`, responses[i].status, errorText);
                          throw new Error(\`API call \${i} failed with status \${responses[i].status}\`);
                      }
                  }
                  
                  [brands, categories] = await Promise.all(
                      responses.map(r => r.json())
                  );
              } catch (error) {
                  console.error('Error loading data:', error);
                  if (confirm('Không thể tải dữ liệu cho phụ kiện. Bạn có muốn tải lại trang không?')) {
                      window.location.reload();
                  }
                  return;
              }
              
              document.getElementById('iDthuongHieuPK').innerHTML = brands.filter(b => b.idPhanLoaiTH === 1)
                  .map(b => \`<option value="\${b.id}">\${b.TenTH}</option>\`).join('');
              
              document.getElementById('idLoaiPK').innerHTML = categories
                  .map(c => \`<option value="\${c.id}">\${c.tenLoai}</option>\`).join('');
              
              document.getElementById('tenSPPK').value = product.tenSP || '';
              document.getElementById('GiaNiemYetPK').value = product.GiaNiemYet || '';
              
              setTimeout(() => {
                  document.getElementById('iDthuongHieuPK').value = product.iDthuongHieu || '';
                  document.getElementById('idLoaiPK').value = product.idLoai || '';
                  document.getElementById('trangThaiPK').value = product.trangThai || '';
              }, 200);
              
              $('#chiTietSPPK').summernote('code', product.chiTietSP || '');
              
              // Hiển thị ảnh hiện tại
              const imagesPK = product.hinhAnh ? product.hinhAnh.split(' || ') : [];
              const containerPK = document.getElementById('currentImagesPK');
              containerPK.innerHTML = '';
              
              for (let i = 0; i < 5; i++) {
                  const div = document.createElement('div');
                  div.style.cssText = 'width: 100px; height: 100px; position: relative;';
                  
                  if (i < imagesPK.length) {
                      div.innerHTML = \`<img src="${process.env.S3_PUBLIC_URL}/Database/Products/\${imagesPK[i]}" class="img-thumbnail" style="width: 100%; height: 100%; object-fit: cover;">\`;
                  } else {
                      div.innerHTML = '<div class="border rounded d-flex align-items-center justify-content-center" style="width: 100%; height: 100%; background: #f8f9fa;"><i class="fas fa-plus fa-2x text-muted"></i></div>';
                  }
                  
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;';
                  input.onchange = function(e) {
                      if (e.target.files[0]) {
                          window.imageChanges[i] = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                              div.querySelector('img, div').outerHTML = \`<img src="\${ev.target.result}" class="img-thumbnail" style="width: 100%; height: 100%; object-fit: cover;">\`;
                          };
                          reader.readAsDataURL(e.target.files[0]);
                      }
                  };
                  div.appendChild(input);
                  containerPK.appendChild(div);
              }
          }
      });
      </script>
      `;

      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Chỉnh Sửa Sản Phẩm</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          </head>
          <body>
              <input type="hidden" id="productType" value="${productType}">
              ${editProductHtml}
              ${scriptFillData}
          </body>
          </html>
      `);
  } catch (error) {
      console.error('Lỗi khi tải trang chỉnh sửa sản phẩm:', error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
};

const updateProduct = async (req, res) => {
  const productId = global.IDSP; 

  try {
      const { product, productType } = await findProductById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
      }

      upload(req, res, async (err) => {
          if (err) {
              return res.status(400).json({ message: err.message });
          }

          let currentImages = product.hinhAnh ? product.hinhAnh.split(' || ') : [];
          
          if (req.files && req.files.length > 0) {
              const indices = req.body.imageIndex;
              const indexArray = Array.isArray(indices) ? indices : [indices];
              
              for (let i = 0; i < req.files.length; i++) {
                  const file = req.files[i];
                  const idx = parseInt(indexArray[i]);
                  if (currentImages[idx]) {
                      await s3Client.send(new DeleteObjectCommand({
                          Bucket: S3_BUCKET,
                          Key: `Database/Products/${currentImages[idx]}`
                      }));
                  }
                  currentImages[idx] = file.key.split('/').pop();
              }
          }

          let updatedData = { ...req.body };

          if (productType === 'PK') {
              updatedData.tenSP = updatedData.tenSPPK;
              updatedData.iDthuongHieu = updatedData.iDthuongHieuPK;
              updatedData.idLoai = updatedData.idLoaiPK;
              updatedData.GiaNiemYet = updatedData.GiaNiemYetPK;
              updatedData.chiTietSP = updatedData.chiTietSPPK;
              updatedData.trangThai = updatedData.trangThaiPK;

              delete updatedData.tenSPPK;
              delete updatedData.iDthuongHieuPK;
              delete updatedData.idLoaiPK;
              delete updatedData.GiaNiemYetPK;
              delete updatedData.chiTietSPPK;
              delete updatedData.trangThaiPK;
          }

          if (req.files && req.files.length > 0) {
              updatedData.hinhAnh = currentImages.filter(img => img).join(' || ');
          }
          
          updatedData.datLich = updatedData.dangkilaithu === 'on' ? 1 : 0;

          const { PutCommand } = require('@aws-sdk/lib-dynamodb');
          const docClient = getDB();
          const tableName = productType === 'XE' ? 'XeOto' : 'PhuKien';
          const finalData = { ...product, ...updatedData };
          await docClient.send(new PutCommand({ TableName: tableName, Item: finalData }));

          return res.status(200).json({ message: 'Cập nhật sản phẩm thành công.' });
      });
  } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;  
    console.log('ID sản phẩm:', id);

    const product = await getProductById(id);

    res.status(200).json(product);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Có lỗi khi lấy sản phẩm.' });
  }
};

const getRelatedProductsController = async (req, res) => {
  try {
    const { GetCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDB();
    
    const result = await docClient.send(new GetCommand({ TableName: 'XeOto', Key: { id: req.params.id } }));
    
    if (!result.Item) return res.json([]);
    
    const related = await getRelatedProducts(result.Item.idKieuDang, req.params.id);
    res.json(related.map(p => ({
      id: p.id,
      name: p.tenSP,
      price: p.GiaNiemYet,
      year: p.namSanXuat,
      mileage: p.soKm,
      fuelType: p.fuelType,
      image: p.hinhAnh ? getS3Url(`Database/Products/${p.hinhAnh.split(' || ')[0]}`) : ''
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDB();
    const { type, brand, minPrice, maxPrice, year, color, style, keyword } = req.query;

    const tableName = type === 'accessory' ? 'PhuKien' : 'XeOto';
    const result = await docClient.send(new ScanCommand({ TableName: tableName }));
    let products = result.Items || [];

    if (keyword) {
      products = products.filter(p => p.tenSP?.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (brand) {
      products = products.filter(p => p.iDthuongHieu === brand);
    }
    if (minPrice) {
      products = products.filter(p => p.GiaNiemYet >= parseInt(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.GiaNiemYet <= parseInt(maxPrice));
    }
    if (year) {
      products = products.filter(p => p.namSanXuat === parseInt(year));
    }
    if (color) {
      products = products.filter(p => p.mauXe?.toLowerCase() === color.toLowerCase());
    }
    if (style) {
      products = products.filter(p => p.kieuDang?.toLowerCase() === style.toLowerCase());
    }

    const formatted = products.map(p => ({
      id: p.id,
      name: p.tenSP,
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.GiaNiemYet),
      year: p.namSanXuat,
      mileage: p.soKm ? p.soKm.toLocaleString('vi-VN') + ' km' : 'N/A',
      fuelType: p.nguyenLieuXe || 'N/A',
      imageUrl: p.hinhAnh ? getS3Url(`Database/Products/${p.hinhAnh.split(' || ')[0]}`) : '',
      brandId: p.iDthuongHieu,
      type: p.kieuDang,
      color: p.mauXe,
      status: p.trangThai
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBrandsController = async (req, res) => {
  try {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const docClient = getDB();
    const { type } = req.query;
    
    const result = await docClient.send(new ScanCommand({ TableName: 'ThuongHieu' }));
    let brands = result.Items || [];
    
    if (type === 'car') {
      brands = brands.filter(b => b.idPhanLoaiTH === 0);
    } else if (type === 'accessory') {
      brands = brands.filter(b => b.idPhanLoaiTH === 1);
    }
    
    res.json(brands.map(b => ({ id: b.id, name: b.TenTH })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCarProduct, getRecentProductsController, getAllProductsController, 
  deleteProductByIdController, createAccessoryProduct, getEditProductPageController,
   updateProduct, getProductByIdController, getRelatedProductsController, searchProductsController, getBrandsController };
