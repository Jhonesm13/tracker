# Sistema de Rastreamento de Entregas

Este projeto é um sistema completo para rastreamento de entregas, composto por um **Backend** em PHP que gerencia a lógica de dados e cache, e um **Frontend** em React que fornece a interface de busca e visualização.


https://github.com/user-attachments/assets/207e2417-f3bc-4b07-857b-4c790a87d5d0


---

## Backend - API (PHP)

O backend é a camada de serviços responsável por processar as requisições de busca, implementar a lógica de caching e integrar dados de APIs externas.

### Tecnologias Utilizadas

* **Linguagem:** PHP
* **Banco de Dados:** MySQL (PDO)
* **Gerenciamento de Dependências:** Composer

### Funcionalidades Principais

* **Consulta Unificada:** Busca entregas por CPF/CNPJ.
* **Mecanismo de Cache:** Prioriza a consulta no banco de dados local para entregas já buscadas, otimizando o desempenho.
* **Integração com API:** Busca novas entregas e dados de transportadoras em endpoints externos quando não estão no cache.

### Estrutura de Camadas

A arquitetura segue o padrão de camadas:

| Diretório/Arquivo | Responsabilidade Principal |
| :--- | :--- |
| `controllers/` | Recebe as requisições HTTP e coordena a resposta. |
| `services/` | Contém a lógica de negócio (decisão de cache ou API). |
| `repositories/` | Lida com a comunicação direta com o banco de dados (MySQL). |
| `database/` | Gerencia a conexão com o MySQL (PDO). |

### Configuração e Instalação (Backend)

1.  **Clone o repositório.**
2.  **Instale as dependências PHP:**
    ```bash
    composer install
    ```
3.  **Configuração do Banco de Dados:**
    * Crie o banco de dados `rastreamento`.
    * Crie as tabelas `entregas` e `transportadoras` (conforme o código em `database/database.php`).
4.  **Servidor Web:** Configure seu servidor (Apache/Nginx) para apontar o *Document Root* para a pasta `public/` do backend.

---

## Frontend - Cliente Web (React)

O frontend é a interface de busca e visualização, desenvolvido para ser intuitivo e reativo.

### Tecnologias Utilizadas

* **Framework:** React
* **Roteamento:** React Router DOM
* **Comunicação:** `fetch` para consumir o Backend.

### Rotas e Funcionalidades

| Rota | Componente | Descrição |
| :--- | :--- | :--- |
| `/` | `Home` | Página inicial para entrada do **CPF/CNPJ** (com máscara automática) e chamada à API. |
| `/entregas` | `ListaEntregas` | Exibe os resultados em cards detalhados, incluindo **progresso visual**, informações de remetente/destinatário e **localização por mapa** (se disponível). |

### Como Executar o Frontend

1.  **Instale as dependências** na pasta do Frontend:
    ```bash
    npm install 
    # ou
    yarn install
    ```
2.  **Inicie a aplicação React:**
    ```bash
    npm start 
    # ou
    yarn start
    ```
    *Certifique-se de que o Backend está ativo na URL configurada.*

---

## Estrutura de Comunicação

O fluxo de dados principal ocorre da seguinte forma:

1.  O usuário insere o CPF na página **Home** (Frontend).
2.  O Frontend envia a requisição `GET /entregas?cpf=` para o **Backend**.
3.  O Backend (`EntregasController` -> `EntregasService`):
    * Tenta buscar no cache (`EntregasRepository`).
    * Se não encontrar, busca nas APIs Mock de entregas e transportadoras.
    * Salva os novos dados no banco de dados (caching).
    * Retorna a lista de entregas.
4.  O Frontend (`ListaEntregas`) recebe a resposta JSON e renderiza os detalhes na interface.
