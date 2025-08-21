export interface AddressResolution {
  address: string;
  name: string | null;
}

export interface ResolveOptions {
  apiEndpoint?: string;
}

const DEFAULT_API_ENDPOINT = 'https://ens-api.gregskril.com';

export async function resolve(
  addresses: string[],
  options: ResolveOptions = {}
): Promise<AddressResolution[]> {
  const { apiEndpoint = DEFAULT_API_ENDPOINT } = options;
  
  if (addresses.length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${apiEndpoint}/batch/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json() as Record<string, string>;
    
    return addresses.map(address => ({
      address,
      name: data[address] || null,
    }));
  } catch (error) {
    console.warn('ENS resolution failed:', error);
    return addresses.map(address => ({
      address,
      name: null,
    }));
  }
}