// ===== CREDENTIALS SERVICE =====

// Função para gerar ID único
function generateId() {
  return 'vc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Função para gerar URL da credencial
function generateCredentialUrl(id) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/verificador.html?credential=${id}`;
}

// Template para credencial verificável
function createVerifiableCredential(nome, tipo, permissoes, issuedAt, expiresAt) {
  const id = generateId();
  const now = new Date().toISOString();
  
  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://unifesp.br/credentials/v1"
    ],
    "id": generateCredentialUrl(id),
    "type": ["VerifiableCredential", "UnifespAccessCredential"],
    "issuer": {
      "id": "did:web:unifesp.br",
      "name": "Universidade Federal de São Paulo"
    },
    "issuanceDate": issuedAt.toISOString(),
    "expirationDate": expiresAt.toISOString(),
    "status": "active", // can be "active", "revoked".
    "credentialSubject": {
      "id": `did:unifesp:${nome.toLowerCase().replace(/\s+/g, '-')}`,
      "name": nome,
      "role": tipo.charAt(0).toUpperCase() + tipo.slice(1),
      "accessPermissions": permissoes,
      "institution": "UNIFESP"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": now,
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:web:unifesp.br#key-1",
      "jws": generateMockSignature(id, nome, permissoes)
    },
    "_internal": {
      "id": id,
      "created": now
    }
  };

  
}

// Gerar assinatura (em produção seria uma assinatura real)
function generateMockSignature(id, nome, permissoes) {
  const data = btoa(JSON.stringify({id, nome, permissoes, timestamp: Date.now()}));
  return `eyJhbGciOiJFZERTQSJ9.${data}.mock_signature_${id.slice(-8)}`;
}