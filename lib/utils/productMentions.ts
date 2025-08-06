import { PRODUCTS } from '@/lib/constants';

// Utility function to detect product mentions in text
export function detectProductMentions(text: string): Array<{ product: string; mentionText: string; context?: string }> {
  const mentions: Array<{ product: string; mentionText: string; context?: string }> = [];
  const lowercaseText = text.toLowerCase();

  // Check for each product name
  Object.entries(PRODUCTS).forEach(([productKey, productConfig]) => {
    const productName = productConfig.name.toLowerCase();
    
    // Simple word boundary detection
    const regex = new RegExp(`\\b${productName}\\b`, 'gi');
    const matches = text.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        // Extract context around the mention (20 characters before and after)
        const index = lowercaseText.indexOf(productName);
        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + productName.length + 20);
        const context = text.slice(start, end).trim();
        
        mentions.push({
          product: productKey,
          mentionText: match,
          context: context !== match ? context : undefined,
        });
      });
    }
  });

  return mentions;
}