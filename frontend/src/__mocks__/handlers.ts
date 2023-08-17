import {graphql, rest } from 'msw'

export const posts = [
    {
        "id": "63f7af68a1e1e8000885dc08#0001",
        "entryId": "63f7af68a1e1e8000885dc08",
        "createdOn": "2023-02-23T18:24:40.677Z",
        "savedOn": "2023-02-23T18:24:42.745Z",
        "createdBy": {
            "displayName": "admin admin"
        },
        "ownedBy": {
            "displayName": "admin admin"
        },
        "organizacoesEmail": "snowypeak@icloud.com",
        "organizacoesCnpj": "87957894000238",
        "organizacoesNome": "SnowyPeak",
        "organizacoesMatriz": {
            "organizacoesNome": "Pontus Vision Brasil"
        },
        "organizacoesTelefone": "21985985783",
        "organizacoesSite": "https://www.snowypeak.com",
        "organizacoesEnderecoObj": {
            "organizacoesEnderecoObjEndereco": "travessa tamandare",
            "organizacoesEnderecoObjComplemento": "condominio",
            "organizacoesEnderecoObjNumero": "987",
            "organizacoesEnderecoObjBairro": "flores",
            "organizacoesEnderecoObjCep": "86578-000",
            "organizacoesEnderecoObjUf": "BA",
            "organizacoesEnderecoObjCidade": "Salvador"
        }
    },
    {
        "id": "63f7af08a1e1e8000885dc07#0001",
        "entryId": "63f7af08a1e1e8000885dc07",
        "createdOn": "2023-02-23T18:23:04.739Z",
        "savedOn": "2023-02-23T18:23:06.257Z",
        "createdBy": {
            "displayName": "admin admin"
        },
        "ownedBy": {
            "displayName": "admin admin"
        },
        "organizacoesEmail": "omar@gmail.com",
        "organizacoesCnpj": "98456789000234",
        "organizacoesNome": "MEI Omar",
        "organizacoesMatriz": {
            "organizacoesNome": "Pontus Vision Brasil"
        },
        "organizacoesTelefone": "45980986799",
        "organizacoesSite": "https://www.omar.com.br",
        "organizacoesEnderecoObj": {
            "organizacoesEnderecoObjEndereco": "Rua Porto Alegre",
            "organizacoesEnderecoObjComplemento": "casa",
            "organizacoesEnderecoObjNumero": "178",
            "organizacoesEnderecoObjBairro": "KLP",
            "organizacoesEnderecoObjCep": "85867890",
            "organizacoesEnderecoObjUf": "PR",
            "organizacoesEnderecoObjCidade": "Foz do Iguaçu"
        }
    },
    {
        "id": "63f7aec4a481f70008c9e82c#0001",
        "entryId": "63f7aec4a481f70008c9e82c",
        "createdOn": "2023-02-23T18:21:56.783Z",
        "savedOn": "2023-02-23T18:21:58.861Z",
        "createdBy": {
            "displayName": "admin admin"
        },
        "ownedBy": {
            "displayName": "admin admin"
        },
        "organizacoesEmail": "pontus@vision.com.br",
        "organizacoesCnpj": "65789874000126",
        "organizacoesNome": "Pontus Vision Brasil",
        "organizacoesMatriz": null,
        "organizacoesTelefone": "11985786984",
        "organizacoesSite": "https://pontusvision.com.br",
        "organizacoesEnderecoObj": {
            "organizacoesEnderecoObjEndereco": "Av Paulista",
            "organizacoesEnderecoObjComplemento": "predio",
            "organizacoesEnderecoObjNumero": "398",
            "organizacoesEnderecoObjBairro": "ABC",
            "organizacoesEnderecoObjCep": "86987098",
            "organizacoesEnderecoObjUf": "SP",
            "organizacoesEnderecoObjCidade": "São Paulo"
        }
    }
]

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql')
// Define handlers that catch the corresponding requests and returns the mock data.
export const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts))
  }),

  jsonPlaceHolder.query('posts', (req, res, ctx) => {
    return res(
      ctx.data({
        posts,
      }),
    )
  }),

]
