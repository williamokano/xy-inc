# XY-INC Backend as a Service
Backend as a Service em nodejs e mongodb

# Api
Por padrão temos duas rotas de recursos
- /entity
  - Rota para criar novos endpoints
- /:entity
  - Rota para o novo endpoint criado

**Todas as rotas seguem o padrão REST, sendo `GET` para buscar dados, `POST` para criar, etc.**

## Listando as entidades existentes
`GET /entity`
```json
[
  {
    "_id": "5907dd47546c960026b0c4d9",
    "updatedAt": "2017-05-02T01:31:14.210Z",
    "createdAt": "2017-05-02T01:13:43.151Z",
    "entity": "users",
    "__v": 0,
    "fields": [
      {
        "name": "firstname",
        "required": true,
        "type": "string"
      },
      {
        "name": "lastname",
        "required": true,
        "type": "string"
      },
      {
        "name": "username",
        "required": true,
        "type": "string"
      },
      {
        "name": "age",
        "required": false,
        "type": "int"
      },
      {
        "name": "balance",
        "required": true,
        "type": "float"
      },
      {
        "name": "dt_nascimento",
        "required": false,
        "type": "date"
      }
    ]
  },
  {
    "_id": "5907f81a0538620f24b96400",
    "updatedAt": "2017-05-02T03:08:10.365Z",
    "createdAt": "2017-05-02T03:08:10.365Z",
    "entity": "conta",
    "__v": 0,
    "fields": [
      {
        "name": "descricao",
        "required": true,
        "type": "string"
      },
      {
        "name": "valor",
        "required": true,
        "type": "float"
      }
    ]
  }
]
```

### Criando uma nova entidade
`POST /entity`
*Exemplo:*
```json
{
    "entity": "usuario",
    "fields": [
      {
        "name": "nome",
        "required": true,
        "type": "string"
      },
      {
        "name": "idade",
        "required": true,
        "type": "int"
      }
    ]
  }
```

### Deletando uma entidade
`DELETE /entity/5907f81a0538620f24b96400`

Será retornado um código http 204 informado que a operação ocorreu com sucesso.

## Utilizando um endpoint dinâmico
Utilizaremos o exemplo criado acima, `usuario`.

### Listando todos os usuários
`GET /usuario` e será retornaod um código http 200 (OK)

### Criando um novo usuário
`POST /usuario` e será retornado um código http 201 (Created)
```json
{
    "nome": "William",
    "idade": 28
}
```

**Obs.:** Caso os dados enviados não estejam de acordo com o schema informado, será retornado um código 422 e a mensagem de erro de validação.

### Buscando um usuário pelo ID
`GET /usuario/8372819283af` e será retornaod um código http 200 (OK)

**Exempo de retorno:**
```json
{
    "_id": "8372819283af",
    "nome": "William Okano",
    "idade": 29,
    "updatedAt": "2017-05-02T01:31:14.210Z",
    "createdAt": "2017-05-02T01:13:43.151Z"
  }
```

### Atualizando um usuário
`PUT /usuario/8372819283af` e será retornado um código http 200 (OK) 
```json
{
    "nome": "William Okano",
    "idade": 29
}
```

**Obs.:** O verbo `PATCH` não foi implementado sendo necessário sempre atualizar o objeto inteiro via `PUT`.

### Deletando um usuário
`DELETE /usuario/8372819283af` e será retornado um código http 204 (No Content)

# Instação
Você precisa do yarn!  
`npm instal -g yarn`

Clone este projeto:  
`git clone git@github.com:williamokano/xy-inc.git`

e então execute  
`yarn install`

# Executando
Você pode escolher por rodar este projeto via `docker` e `docker-compose` ou então rodar manualmente. O mais aconselhado é rodar via docker.  

## Com docker e docker-compose
Execute `docker-compose up` e abra o browser no seguinte endereço `http://localhost:3000`

## Manualmente
Tenha instalado as seguintes dependências:  
- nodejs 6+
- mongodb
- yarn

Faça a correção dos arquivos env dentro da pasta `src/envs` com as configurações necessárias (endereço do host do mongo) e execute `yarn start`. Abra o browser na url `http://localhost:3000`

# Testes
Para executar os testes execute o comando abaixo:  
`yarn test`

Se quiser gerar a cobertura, execute:  
`yarn test:coverage`
