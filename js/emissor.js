// Carregar lista de credenciais na página inicial
function loadCredentialsList() {
  const container = document.getElementById('credenciais-emitidas');
  const credenciais = JSON.parse(localStorage.getItem('unifesp_credenciais') || '{}');
  
  if (Object.keys(credenciais).length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhuma credencial emitida ainda.</p>';
    return;
  }
  
  container.innerHTML = '';
  Object.values(credenciais).forEach(vc => {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 bg-gray-50 flex justify-between items-center';
    div.innerHTML = `
      <div>
        <h4 class="font-semibold">${vc.credentialSubject.name}</h4>
        <p class="text-sm text-gray-600">${vc.credentialSubject.role} - ${vc.credentialSubject.accessPermissions.length} permissões</p>
        <p class="text-xs text-gray-500">ID: ${vc._internal.id}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="copyToClipboard('', '${vc.id}')" class="bg-unifespGreen-600 text-white px-3 py-1 rounded text-sm hover:bg-unifespGreen-700 transition">
          Copiar URL
        </button>
        <button onclick="deleteCredential('${vc._internal.id}')" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
          Excluir
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Função para copiar para clipboard
function copyToClipboard(inputId, url = null) {
  const text = url || document.getElementById(inputId).value;
  navigator.clipboard.writeText(text).then(() => {
    alert('URL copiada para a área de transferência!');
  }).catch(() => {
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('URL copiada para a área de transferência!');
  });
}

// Excluir credencial
function deleteCredential(id) {
  if (confirm('Tem certeza que deseja excluir esta credencial?')) {
    const credenciais = JSON.parse(localStorage.getItem('unifesp_credenciais') || '{}');
    delete credenciais[id];
    localStorage.setItem('unifesp_credenciais', JSON.stringify(credenciais));
    loadCredentialsList();
    alert('Credencial excluída com sucesso!');
  }
}

// Processar emissão de credencial
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-emissao');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value.trim();
      const tipo = document.getElementById('tipo').value;
      const permissoes = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
      const validityDays = parseInt(document.getElementById('validityPeriod').value, 10);
      const issuedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(issuedAt.getDate() + validityDays);
      if (!nome || !tipo) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      if (permissoes.length === 0) {
        alert('Selecione pelo menos uma permissão de acesso.');
        return;
      }
      
      // Criar credencial verificável
      const vc = createVerifiableCredential(nome, tipo, permissoes, issuedAt, expiresAt);
      
      // Salvar no localStorage
      const credenciais = JSON.parse(localStorage.getItem('unifesp_credenciais') || '{}');
      credenciais[vc._internal.id] = vc;
      localStorage.setItem('unifesp_credenciais', JSON.stringify(credenciais));
      
      // Mostrar resultado
      document.getElementById('url-credencial').value = vc.id;
      document.getElementById('credencial-json').textContent = JSON.stringify(vc, null, 2);
      document.getElementById('resultado-emissao').classList.remove('hidden');
      
      // Limpar formulário
      form.reset();
      
      // Scroll para o resultado
      document.getElementById('resultado-emissao').scrollIntoView({ behavior: 'smooth' });
      
      alert('Credencial emitida com sucesso! A URL foi gerada e pode ser copiada.');
    });
  }
});