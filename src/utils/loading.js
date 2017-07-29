export const showLoading = () => {
  const loadingIndicator = document.querySelector('loading-indicator');
  loadingIndicator.classList.remove('hidden');
}

export const hideLoading = () => {
  const loadingIndicator = document.querySelector('loading-indicator');
  loadingIndicator.classList.add('hidden');
}
