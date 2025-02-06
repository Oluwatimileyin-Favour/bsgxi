export function findMostFrequent<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
  
    const frequencyMap = new Map<T, number>();
  
    for (const item of arr) {
      frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
    }
  
    let mostFrequentItem: T | null = null;
    let maxCount = 0;
  
    for (const [item, count] of frequencyMap.entries()) {
      if (count > maxCount) {
        mostFrequentItem = item;
        maxCount = count;
      }
    }
  
    return mostFrequentItem;
}