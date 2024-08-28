import { CosmosClient } from '@azure/cosmos'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const cosmosClient = new CosmosClient({
  endpoint: process.env.PH_COSMOS_ENDPOINT || 'https://localhost:8081/',
  key: process.env.PH_COSMOS_KEY ||'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='
})
const { database } = await cosmosClient.databases.createIfNotExists({
  id: 'cosmicworks',
  throughput: 400
})

const { container } = await database.containers.createIfNotExists({
  id: 'products',
  partitionKey: {
    paths: [
      '/id'
    ]
  }
})

const item = {
  id: '68719518371',
  name: 'Kiama classic surfboard'
}

container.items.upsert(item)


const querySpec = {
    query: "select * from products p where p.name=@name",
    parameters: [
        {
            name: "@name",
            value: 'Kiama classic surfboard'
        }
    ]
};

// Get items 
const { resources } = await container.items.query(querySpec).fetchAll();

for (const item of resources) {
    console.log(`${item.id}: ${item.name}, ${item.sku}`);
}
