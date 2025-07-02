const errorMessagesPT: Record<string, string> = {
  'validation.required': 'Campo obrigatório',
  'validation.in': 'Tipo deve ser Admin ou Comum',
  'validation.email': 'E-mail inválido',
  'validation.minLength': 'Mínimo de {min} caracteres',
  'validation.maxLength': 'Máximo de {max} caracteres',
  'validation.unique': 'Já existe um usuário com este e-mail',
  // Adicione outros códigos de erro e traduções conforme necessário
}

const fieldNamesPT: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  role: 'Tipo',
  password: 'Senha',

  // Adicione outros campos se necessário
}

export function translateApiErrors(errors: Record<string, string[]>): Record<string, string[]> {
  const traduzidos: Record<string, string[]> = {}
  for (const campo in errors) {
    const campoTraduzido = fieldNamesPT[campo] || campo
    traduzidos[campoTraduzido] = errors[campo].map((codigo) => errorMessagesPT[codigo] || codigo)
  }
  return traduzidos
}
