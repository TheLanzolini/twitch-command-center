export const showLoading = () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  console.log('show')
  loadingIndicator.classList.remove('hidden')
}

export const hideLoading = () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  console.log('hide')
  loadingIndicator.classList.add('hidden')
}
