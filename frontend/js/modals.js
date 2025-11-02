// Auto-open modal when turbo frame loads
document.addEventListener('turbo:frame-load', (event) => {
  if (event.target.id === 'ingredient_modal') {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ingredientModal'))
    modal.show()
  }

  if (event.target.id === 'category_modal') {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'))
    modal.show()
  }
})

// Auto-open modal when turbo frame loads
document.addEventListener('turbo:frame-load', (event) => {
  if (event.target.id === 'ingredient_modal') {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ingredientModal'))
    modal.show()
  }

  if (event.target.id === 'category_modal') {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'))
    modal.show()
  }
})

// Close modal after successful form submission
document.addEventListener('turbo:submit-end', (event) => {
  if (event.detail.success && event.target.id === 'add-ingredient-form') {
    const modal = bootstrap.Modal.getInstance(document.getElementById('ingredientModal'))
    if (modal) {
      modal.hide()
    }
  }

  if (event.detail.success && event.target.id === 'add-category-form') {
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'))
    if (modal) {
      modal.hide()
    }
  }
})
