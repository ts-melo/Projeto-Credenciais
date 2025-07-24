// Navegação entre páginas
function showPage(pageId) {
  document.querySelectorAll('[id$="-page"]').forEach(page => {
    page.classList.add('hidden');
  });
  document.getElementById(pageId + '-page').classList.remove('hidden');
  
  if (pageId === 'home') {
    // Pequeno delay para garantir que a página foi renderizada
    setTimeout(() => {
      loadCredentialsList();
    }, 100);
  }
}