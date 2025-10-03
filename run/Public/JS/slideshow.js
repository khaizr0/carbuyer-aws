let slideIndex = 1;
let slideTimer;

// Hiển thị slide hiện tại
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";  
  dots[slideIndex - 1].className += " active";
}

// Chuyển tới slide kế tiếp hoặc trước đó
function plusSlides(n) {
  clearTimeout(slideTimer);  // Dừng tự động khi người dùng nhấn nút
  showSlides(slideIndex += n);
  autoSlides();  // Sau khi nhấn, tiếp tục tự động chạy
}

// Đặt slide hiện tại dựa trên số
function currentSlide(n) {
  clearTimeout(slideTimer);  // Dừng tự động khi người dùng chọn
  showSlides(slideIndex = n);
  autoSlides();  // Sau khi nhấn, tiếp tục tự động chạy
}

// Chạy tự động slide
function autoSlides() {
  clearTimeout(slideTimer);  // Xóa bất kỳ hẹn giờ nào trước đó
  slideTimer = setTimeout(function () {
    plusSlides(1);  // Tự động chuyển tới slide tiếp theo
  }, 5000);  // Chạy mỗi 5 giây
}

// Khởi tạo slideshow
showSlides(slideIndex);
autoSlides();
