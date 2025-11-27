// Beck website scripts
document.addEventListener('DOMContentLoaded', () => {
  console.log('Beck website loaded');
  
  const downloadButtons = document.querySelectorAll('a[download]');
  
  downloadButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const pdfUrl = button.getAttribute('href');
      const fileName = button.getAttribute('download');
      
      try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(pdfUrl, '_blank');
      }
    });
  });

  initSafetyPlanImageViewer();
});

function initSafetyPlanImageViewer() {
  const slider = document.getElementById('safety-slider');
  if (!slider) return;

  const images = slider.querySelectorAll('.beck-slider-image');
  const dotsContainer = document.getElementById('safety-dots');
  const dots = dotsContainer.querySelectorAll('.beck-dot');
  const prevArrow = document.getElementById('safety-arrow-prev');
  const nextArrow = document.getElementById('safety-arrow-next');
  
  let currentPage = 0;
  const totalPages = images.length;

  function showPage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    if (prevArrow && nextArrow) {
      prevArrow.disabled = index <= 0;
      nextArrow.disabled = index >= totalPages - 1;
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentPage = index;
      showPage(currentPage);
    });
  });

  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
      }
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        showPage(currentPage);
      }
    });
  }

  let touchStartX = null;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].screenX - touchStartX;
    const threshold = 50;

    if (dx < -threshold && currentPage < totalPages - 1) {
      currentPage++;
      showPage(currentPage);
    } else if (dx > threshold && currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }

    touchStartX = null;
  });

  showPage(currentPage);
}

