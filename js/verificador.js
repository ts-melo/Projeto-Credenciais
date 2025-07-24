function verificarAcesso(labName, urlInputId, resultDivId) {
  const urlInput = document.getElementById(urlInputId).value.trim();
  const resultadoDiv = document.getElementById(resultDivId);

  if (!urlInput) {
    alert('Por favor, cole a URL da credencial.');
    return;
  }

  try {
    const url = new URL(urlInput);
    const params = new URLSearchParams(url.search);
    const credentialParam = params.get('credential');
  
    if (!credentialParam) {
      showVerificationResult(false, 'URL inválida. A URL deve conter um identificador de credencial válido.', resultadoDiv);
      return;
    }
  
    const credenciais = JSON.parse(localStorage.getItem('unifesp_credenciais') || '{}');
    const credencial = credenciais[credentialParam];
  
    if (!credencial) {
      showVerificationResult(false, 'Credencial não encontrada. Verifique se a URL está correta.', resultadoDiv);
      return;
    }
    if (credencial.status === 'revoked') {
      showVerificationResult(false, 'Credencial revogada. Entre em contato com o emissor para mais informações.', resultadoDiv);
      return;
    }
  
    const now = new Date();
    const expiration = new Date(credencial.expirationDate);
    
    if (now > expiration) {
      showVerificationResult(false, 'Credencial expirada. Entre em contato com o emissor para renovar.', resultadoDiv);
      return;
    }
  
    const temPermissao = credencial.credentialSubject.accessPermissions.includes(labName);
  
    if (temPermissao) {
      showVerificationResult(true, `Acesso AUTORIZADO para ${credencial.credentialSubject.name} no ${labName}.`, resultadoDiv, credencial);
    } else {
      showVerificationResult(false, `Acesso NEGADO. ${credencial.credentialSubject.name} não possui permissão para acessar o ${labName}.`, resultadoDiv);
    }
  } catch (error) {
    showVerificationResult(false, 'URL inválida. Verifique se a URL está correta.', resultadoDiv);
    console.error('URL parsing error:', error);
  }
}

function showVerificationResult(sucesso, mensagem, resultadoDiv, credencial = null) {
  const corFundo = sucesso ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const corTexto = sucesso ? 'text-green-800' : 'text-red-800';
  const icone = sucesso ? '✅' : '❌';

  let detalhesCredencial = '';
  if (credencial) {
    detalhesCredencial = `
      <div class="mt-4 pt-4 border-t border-gray-200">
        <h4 class="font-semibold mb-2">Detalhes da Credencial:</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><strong>Nome:</strong> ${credencial.credentialSubject.name}</div>
          <div><strong>Tipo:</strong> ${credencial.credentialSubject.role}</div>
          <div><strong>Emitido em:</strong> ${new Date(credencial.issuanceDate).toLocaleDateString()}</div>
          <div><strong>Expira em:</strong> ${new Date(credencial.expirationDate).toLocaleDateString()}</div>
        </div>
        <div class="mt-2">
          <strong>Permissões:</strong> ${credencial.credentialSubject.accessPermissions.join(', ')}
        </div>
      </div>
    `;
  }

  resultadoDiv.innerHTML = `
    <div class="border rounded-lg p-6 ${corFundo}">
      <h3 class="text-lg font-semibold ${corTexto} mb-3">${icone} ${mensagem}</h3>
      ${detalhesCredencial}
    </div>
  `;
  
  resultadoDiv.classList.remove('hidden');
  resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}