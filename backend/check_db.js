const { Client } = require('./src/models');

async function checkClients() {
  try {
    const count = await Client.count();
    console.log(`Total Clients in DB: ${count}`);
    
    const clients = await Client.findAll({ limit: 5 });
    console.log('Recent Clients:', JSON.stringify(clients, null, 2));
  } catch (error) {
    console.error('DB Check Failed:', error);
  }
}

checkClients();
