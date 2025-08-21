import { resolve } from '@ens-rush-resolution/core';

async function demo() {
  console.log('🚀 Rush Resolution Node.js Example\n');

  // Test single address
  console.log('📍 Resolving single address...');
  const singleResult = await resolve(['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']);
  console.log(`${singleResult[0].address} → ${singleResult[0].name || 'No ENS name'}\n`);

  // Test multiple addresses
  console.log('📍 Resolving multiple addresses...');
  const addresses = [
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
    '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5', // nick.eth
    '0x1234567890123456789012345678901234567890'  // fake address
  ];
  
  const results = await resolve(addresses);
  
  results.forEach(result => {
    console.log(`${result.address} → ${result.name || 'No ENS name'}`);
  });

  console.log('\n✅ Demo complete!');
}

demo().catch(console.error);