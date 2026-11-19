export function checkElement<T>(value: T | null, elementSelector: string): T {
  if(value === null) {
    throw new Error(`Не найден элемент ${elementSelector} на странице`);
  }

  return value
}
