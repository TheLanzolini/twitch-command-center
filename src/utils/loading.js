export const showLoading = () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  loadingIndicator.classList.remove('hidden')
  document.body.classList.add('loading')
}

export const hideLoading = () => {
  const loadingIndicator = document.querySelector('.loading-indicator')
  loadingIndicator.classList.add('hidden')
  document.body.classList.remove('loading')
}
