import { timeout } from '@/utils';
import type { Order } from '@/stores/orders';

export type ListOrdersByAccountParams = {
  accountId: string;
};

export const listOrdersByAccount = async (
  params: ListOrdersByAccountParams,
): Promise<Order[]> => {
  console.log('REQUEST::listOrdersByAccount', params);
  await timeout(3000);
  return [];
};
