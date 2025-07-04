# Gerador CNAB - Frontend

Este projeto é o frontend para a aplicação de geração de CNAB. Foi desenvolvido com Vue 3, utilizando Vite para uma experiência de desenvolvimento moderna e ágil.

## ✨ Funcionalidades

* Autenticação de usuários com JWT.
* Perfis de usuário (Admin e Usuário) com diferentes permissões.
* Tela para importação de arquivos Excel (`.xlsx`) para processamento.
* Listagem e monitoramento do status dos processamentos (pendente, processando, concluído, erro).
* Download do arquivo Excel original e do arquivo CNAB gerado.
* Filtros de processamentos por status e data.
* Gestão de usuários (disponível para admins).

## 🚀 Rodando com Docker (Recomendado)

Para subir o ambiente de desenvolvimento de forma rápida e isolada, utilize Docker.

**Pré-requisitos:**
* Docker
* Docker Compose

### Passos para a Instalação

1.  **Clone o repositório:**
    ```sh
    git clone [URL-DO-SEU-REPOSITORIO]
    cd [NOME-DA-PASTA-DO-PROJETO]
    ```

2.  **Crie o arquivo de ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```sh
    cp .env.example .env
    ```
    *Observação: Abra o arquivo `.env` e configure as variáveis de ambiente necessárias, como `API_HOST`, que aponta para a URL da sua API backend.*

3.  **Construa e inicie os containers:**
    Este comando irá construir a imagem Docker do frontend e iniciar o serviço em segundo plano.
    ```sh
    docker-compose up -d --build
    ```

4.  **Acesse a aplicação:**
    Após a conclusão, a aplicação estará disponível em **[http://localhost:5173](http://localhost:5173)**.

## 🔑 Credenciais de Acesso

Para acessar a aplicação, utilize as seguintes credenciais de exemplo:

* **Usuário:** `test@example.com`
* **Senha:** `password`

## 📄 Formato do Arquivo de Importação

A importação é feita através de um arquivo Excel (`.xlsx`). A planilha deve conter um cabeçalho e seguir o seguinte formato de colunas:

| Coluna | Nome do Campo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| A | `contrato` | Número do contrato a ser processado. | 12345 |
| B | `cliente` | Nome do cliente associado ao contrato. | João Silva |
| C | `valor` | Valor financeiro da operação. | 1000.50 |
| D | `data` | Data da operação no formato AAAA-MM-DD. | 2025-06-01 |

## 🛠️ Scripts para Desenvolvimento Local (Sem Docker)

Se preferir rodar o projeto localmente sem o Docker, siga os passos abaixo.

**Pré-requisitos:**
* Node.js (versão 18 ou superior)

### Instalar Dependências
```sh
npm install
```

### Desenvolvimento (Hot-Reload)

```sh
npm run dev
```

### Compilar e Minificar para Produção

```sh
npm run build
```

### Executar Linter para Verificar Estilo de Código

```sh
npm run lint
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
