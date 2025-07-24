// ===== CONFIGURAÇÕES =====

// Configuração dos laboratórios
const LABORATORIES = [
  {
    id: 'lab-redes',
    name: 'Laboratório de Redes',
    location: 'Bloco A - 3º Andar',
    description: 'Laboratório especializado em redes de computadores e infraestrutura de TI.',
    icon: '🌐',
    color: 'bg-blue-500'
  },
  {
    id: 'lab-ia',
    name: 'Laboratório de IA',
    location: 'Bloco B - 2º Andar',
    description: 'Laboratório de Inteligência Artificial e Machine Learning.',
    icon: '🤖',
    color: 'bg-purple-500'
  },
  {
    id: 'lab-embarcados',
    name: 'Laboratório de Sistemas Embarcados',
    location: 'Bloco C - 1º Andar',
    description: 'Desenvolvimento de sistemas embarcados e IoT.',
    icon: '🔧',
    color: 'bg-green-500'
  }
];

// Configurações do sistema
const CONFIG = {
  CREDENTIAL_BASE_URL: 'https://credentials.unifesp.br/verify',
  ISSUER_DID: 'did:web:unifesp.br',
  ISSUER_NAME: 'Universidade Federal de São Paulo',
  CREDENTIAL_VALIDITY_YEARS: 1,
  STORAGE_KEY: 'unifesp_credenciais'
};