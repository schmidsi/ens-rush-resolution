import { resolve, type ResolveOptions } from '@ens-rush-resolution/core';

const ETHEREUM_ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/g;

export interface AutoResolveOptions extends ResolveOptions {
  selector?: string;
  onResolve?: (address: string, name: string | null, element: Element) => void;
}

interface AddressElement {
  address: string;
  element: Element;
  textNode: Text;
  startIndex: number;
  endIndex: number;
}

function findAddressesInTextNode(textNode: Text): AddressElement[] {
  const text = textNode.textContent || '';
  const addresses: AddressElement[] = [];
  let match;

  ETHEREUM_ADDRESS_REGEX.lastIndex = 0;
  
  while ((match = ETHEREUM_ADDRESS_REGEX.exec(text)) !== null) {
    addresses.push({
      address: match[0],
      element: textNode.parentElement!,
      textNode,
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }

  return addresses;
}

function findAllAddresses(root: Element = document.body): AddressElement[] {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node: Text) {
        // Skip nodes inside elements with data-ens-rush="false"
        let parent = node.parentElement;
        while (parent) {
          if (parent.dataset.ensRush === 'false' || parent.dataset.ensRush === 'skip') {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const allAddresses: AddressElement[] = [];
  let node;

  while (node = walker.nextNode()) {
    const textNode = node as Text;
    const addresses = findAddressesInTextNode(textNode);
    allAddresses.push(...addresses);
  }

  return allAddresses;
}

function updateAddressInDOM(addressElement: AddressElement, ensName: string | null) {
  const { textNode, startIndex, endIndex, address } = addressElement;
  const text = textNode.textContent || '';
  
  if (!ensName) {
    return;
  }

  const beforeText = text.substring(0, startIndex);
  const afterText = text.substring(endIndex);
  
  const ensSpan = document.createElement('span');
  ensSpan.textContent = ensName;
  ensSpan.title = address;

  const parentElement = textNode.parentElement!;
  
  if (beforeText) {
    parentElement.insertBefore(document.createTextNode(beforeText), textNode);
  }
  
  parentElement.insertBefore(ensSpan, textNode);
  
  if (afterText) {
    parentElement.insertBefore(document.createTextNode(afterText), textNode);
  }
  
  parentElement.removeChild(textNode);
}

export async function autoResolve(options: AutoResolveOptions = {}): Promise<void> {
  const { selector, onResolve, ...resolveOptions } = options;
  
  const root = selector ? document.querySelector(selector) : document.body;
  if (!root) {
    console.warn('Auto-resolve: Root element not found');
    return;
  }

  const addressElements = findAllAddresses(root as Element);
  
  if (addressElements.length === 0) {
    console.log('Auto-resolve: No Ethereum addresses found');
    return;
  }

  const uniqueAddresses = [...new Set(addressElements.map(ae => ae.address))];
  console.log(`Auto-resolve: Found ${addressElements.length} addresses (${uniqueAddresses.length} unique)`);

  try {
    const resolutions = await resolve(uniqueAddresses, resolveOptions);
    const resolutionMap = new Map(resolutions.map(r => [r.address, r.name]));

    addressElements.forEach(addressElement => {
      const ensName = resolutionMap.get(addressElement.address);
      
      if (onResolve) {
        onResolve(addressElement.address, ensName || null, addressElement.element);
      }
      
      updateAddressInDOM(addressElement, ensName || null);
    });

    const resolvedCount = resolutions.filter(r => r.name).length;
    console.log(`Auto-resolve: Resolved ${resolvedCount}/${uniqueAddresses.length} addresses to ENS names`);
  } catch (error) {
    console.error('Auto-resolve: Failed to resolve addresses', error);
  }
}

// Auto-initialize when imported in browser
if (typeof window !== 'undefined') {
  // Disclaimer warning
  console.warn(
    '⚠️ ENS Rush Resolution Disclaimer:\n' +
    '• This is NOT an official ENS Labs or ENS DAO project\n' +
    '• Name/address resolution might be incorrect or outdated\n' +
    '• No guaranteed uptime or service reliability\n' +
    '• Use at your own risk for non-critical applications\n' +
    '• Learn more about official ENS resolution: https://docs.ens.domains/resolution'
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Auto-resolve: DOM loaded, starting auto-resolution...');
      autoResolve();
    });
  } else {
    console.log('Auto-resolve: DOM already loaded, starting auto-resolution...');
    autoResolve();
  }
}