# Backend de cadastro e login

## Descrição
Projeto feito para colocar em prática a criação de APIs com Node JS. Nele é possível o usuario se cadastrar, fazer o login, alterar seus dados e até deletar seu perfil.

## Tecnologias utilizadas
- Node.js
- MongoDB
- JWT (JsonWebToken)
- Argon2id para hash de senhas
- dontenv

## Tecnologias na máquina
- Node.js
- MongoDB

## Como executar o projeto
Clone o repositório.  
Instale as dependências.  
Execute o comando abaixo no diretório do projeto:  
`npm install`  
Configure o .env:  
Crie um arquivo chamado .env na raiz do projeto com a seguinte estrutura:  
```
URI = mongodb://localhost:27017
DB_NAME = nome_do_banco
JWT_KEY = sua_chave_segura
```

Significado de cada variável:  
URI: Endereço de conexão com o servidor MongoDB.   
Se usar localmente: `mongodb://localhost:27017`
Se usar Atlas: será a URI que o próprio MongoDB Atlas fornece.

DB_NAME: Nome do banco que a aplicação vai usar.

JWT_KEY: Uma chave secreta usada para gerar e validar os tokens JWT.
  
Execute o comando abaixo no diretório do projeto para iniciar o servidor:  
`npm start`  

5Utilize a API:
Agora você já pode testar as rotas usando a ferramenta de sua preferência (Insomnia, Postman, Thunder Client, etc).

## Rotas

### `POST /cadastrar`

Cadastra um novo usuario.

#### Corpo esperado:
```json
{
    "usuario": "texto",
    "senha": "texto",
    "confirmarSenha": "texto",
    "descricao": "texto",
    "imgPerfil": 1
}

```
imgPerfil: número de 0 a 5.

#### Possíveis respostas:

- 201 - Usuario cadastrado com sucesso.
- 400 - Dados inválidos ou campos obrigatórios não preenchidos.
- 500 - Erro ao cadastrar usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/CadastroExemplo.png)

### `POST /login`

Realiza a autenticação do usuario.

#### Corpo esperado:
```json
{
    "usuario": "texto",
    "senha": "texto"
}

```

#### Possíveis respostas:

- 200 - Login bem sucedido.
- 400 - Campos obrigatórios não preenchidos.
- 401 - Dados inválidos.

### Exemplo de uso:
![Exemplo](/assetsReadme/LoginExemplo.png)

### `GET /dados`

Retorna os dados do usuario autenticado.

#### Headers:
```headers
{
    Authorization: Baerer <Token>
}

```

#### Possíveis respostas:

- 200 - Dados retornados com sucesso.
- 401 - Token inválido ou não fornecido.
- 404 - Usuario não encontrado.
- 500 - Erro ao buscar usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/DadosExemplo.png)

### `GET /verificarUsuario/:nomeUsuario`

Verifica se o nome de usuario já está em uso.

#### Parametros da url:
`nomeUsuario`: nome do usuario a ser verificado.

#### Exemplo
`GET /verificarUsuario/Joao`

#### Possíveis respostas:

- 200 - retornou com sucesso se está disponivel ou não.
- 500 - Erro ao verificar alteração de usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/VerificarUsuarioExemplo.png)

### `GET /verificarAlterarUsuario/:nomeUsuario`

Verifica se o nome de usuario já está em uso.

#### Exemplo
`GET /verificarAlterarUsuario/Maria`

#### Parametros da url:
`nomeUsuario`: nome do usuario a ser verificado.

#### Possíveis respostas:

- 200 - retornou com sucesso se está disponivel ou não.
- 500 - Erro ao verificar alteração de usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/VerificarAlterarUsuarioExemplo.png)

### `PUT /alterarDados`

Altera os dados do usuario que enviou a requisição.

#### Headers:
```headers
{
    Authorization: Baerer <Token>
}

```

#### Corpo esperado:
```json
{
    "usuario": "texto",
    "descricao": "texto",
    "imgPerfil": 0
}

```
imgPerfil: número de 0 a 5.

#### Possíveis respostas:

- 200 - Usuario alterado com sucesso.
- 400 - Dados inválidos.
- 400 - Usuario já cadastrado com nome enviado.
- 500 - Erro ao alterar usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/AlterarDadosExemplo.png)

### `DELETE /deletarUsuario`

Deleta o usuário do sistema.

#### Headers:
```
{
    Authorization: Baerer <Token>
}
```

#### Possíveis respostas:

- 200 - Usuario deletado.
- 404 - Usuario não encontrado.
- 500 - Erro ao deletar usuario.

### Exemplo de uso:
![Exemplo](/assetsReadme/DeletarUsuarioExemplo.png)

## Middlewares

- cadastrarMiddleware - Usado para válidar dados do cadastro.
- loginMiddleware - Válida dados de login.
- alterarDadosMiddleware - validad dados da alteração de perfil.
- verificarTokenMiddleware - Protege as rotas com JWT.

## Models

### Hash

Contem duas funções para  auxiliar na manipulação das senhas.

1. hashSenha(senha)  
   Recebe a senha, criptografa com Argon2id e retorna ela criptografada.
2. verificarSenha(senhaHash, senha)  
Recebe a senha criptografada e a senha para ser comparada se são iguais. Retorna se é ou não igual.