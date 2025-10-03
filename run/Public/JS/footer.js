const footerHTML = `
            <div class="footer">
                <div class="footer-main">
                    <div class="footer-columns">
                        <div class="footer-column">
                            <h4>GIỚI THIỆU</h4>
                            <p> Auto là đơn vị chuyên hoạt động trong lĩnh vực kinh doanh các loại xe...</p>
                            <p>Tiêu chí của chúng tôi: Chỉ Xe Chất - Giá Tốt Nhất!</p>
                        </div>

                        <div class="footer-column">
                            <h4>THÔNG TIN LIÊN HỆ</h4>
                            <address>
                                Địa chỉ - Trụ sở & Showroom HCM:<br>
                                2B HCM<br><br>
                                Chi nhánh HN:<br>
                                Số 437  Hà Nội
                            </address>
                            <p>Hotline: 8388 888 886<br>0919 555 555</p>
                            <p>Email: info@autoluot.com</p>
                        </div>

                        <div class="footer-column">
                            <h4>FACEBOOK</h4>
                            <div>
                                <img src="facebook-icon.png" alt="Facebook">
                            </div>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p>Công ty TNHH Vina - GPKD số 0317 do Sở KH và ĐT TP Hồ Chí Minh cấp ngày 19/10/202<br>
                        Địa chỉ:  Tp. Hồ Chí Minh</p>
                    </div>
                </div>
            </div>
        `;

        // Chèn footer vào div với id 'footer-container'
        document.getElementById("footer-container").innerHTML = footerHTML;