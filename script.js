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
});

