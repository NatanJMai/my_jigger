// Plain JavaScript Modal Handler
document.addEventListener('click', function(e) {
  // Open modal links - fetch content via AJAX
  const modalLink = e.target.closest('a[data-modal]');
  if (modalLink) {
    e.preventDefault();
    const modalId = modalLink.getAttribute('data-modal');
    let url = modalLink.getAttribute('href');
    
    const contentId = modalId.replace('Modal', '-modal-content');
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const contentDiv = document.getElementById(contentId);
        const modal = document.getElementById(modalId);
        
        if (contentDiv) contentDiv.innerHTML = html;
        
        // Show modal
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Add backdrop
        if (!document.querySelector('.modal-backdrop')) {
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop show';
          document.body.appendChild(backdrop);
        }
      })
      .catch(err => console.error('Error loading modal content:', err));
    return;
  }
  
  // Close modal buttons
  const closeBtn = e.target.closest('[data-bs-dismiss="modal"]');
  if (closeBtn) {
    const modal = closeBtn.closest('.modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
    return;
  }
  
  // Close on backdrop click
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('show');
    e.target.style.display = 'none';
    document.body.classList.remove('modal-open');
    e.target.remove();
  }
});

// Handle form submission - redirect to same page after submit
document.addEventListener('submit', function(e) {
  const form = e.target;
  if (form.closest('.modal')) {
    // Let it submit normally, page will reload
  }
});
