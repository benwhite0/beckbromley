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
  const pageInfo = document.getElementById('safety-img-info');
  const prevBtn = document.getElementById('safety-img-prev');
  const nextBtn = document.getElementById('safety-img-next');
  
  let currentPage = 0;
  const totalPages = images.length;

  function showPage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    
    pageInfo.textContent = `Page ${index + 1} / ${totalPages}`;
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= totalPages - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

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

