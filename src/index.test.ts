import { describe, it, expect } from 'bun:test';
import { resolve } from './index';

describe('ENS Resolution', () => {
  it('should resolve a single address to name', async () => {
    const addresses = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045']; // vitalik.eth
    const result = await resolve(addresses);
    
    expect(result).toHaveLength(1);
    expect(result[0]?.address).toBe(addresses[0]);
    expect(result[0]?.name).toBe('vitalik.eth');
  });

  it('should resolve multiple addresses to names', async () => {
    const addresses = [
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
      '0x983110309620D911731Ac0932219af06091b6744'  // brantly.eth
    ];
    const result = await resolve(addresses);
    
    expect(result).toHaveLength(2);
    expect(result[0]?.address).toBe(addresses[0]);
    expect(result[0]?.name).toBe('vitalik.eth');
    expect(result[1]?.address).toBe(addresses[1]);
    expect(result[1]?.name).toBe('brantly.eth');
  });

  it('should handle upper and lowercase addresses', async () => {
    const lowerCase = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
    const upperCase = '0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045';
    const mixedCase = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    
    const addresses = [lowerCase, upperCase, mixedCase];
    const result = await resolve(addresses);
    
    expect(result).toHaveLength(3);
    
    // All should resolve to vitalik.eth regardless of case
    for (let i = 0; i < result.length; i++) {
      expect(result[i]?.address).toBe(addresses[i]);
      expect(result[i]?.name).toBe('vitalik.eth');
    }
  });

  it('should return null for addresses without ENS names', async () => {
    const addresses = ['0x1234567890123456789012345678901234567890']; // Invalid/non-existent
    const result = await resolve(addresses);
    
    expect(result).toHaveLength(1);
    expect(result[0]?.address).toBe(addresses[0]);
    expect(result[0]?.name).toBe(null);
  });

  it('should handle API errors gracefully', async () => {
    const addresses = ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'];
    const result = await resolve(addresses, { 
      apiEndpoint: 'https://invalid-endpoint-that-does-not-exist.com' 
    });
    
    expect(result).toHaveLength(1);
    expect(result[0]?.address).toBe(addresses[0]);
    expect(result[0]?.name).toBe(null);
  });

  it('should return empty array for empty input', async () => {
    const result = await resolve([]);
    expect(result).toEqual([]);
  });
});