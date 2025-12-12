export function createQueryKey(key: string) {
  const queryKey = {
    all: [key] as const,
    lists: () => [...queryKey.all, 'list'] as const,
    list: (filters: any) => [...queryKey.lists(), filters] as const,
    details: () => [...queryKey.all, 'detail'] as const,
    detail: (id: number) => [...queryKey.details(), id] as const,
  };
  return queryKey;
}
