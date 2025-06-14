import type { Merchant } from '@/stores/merchant/merchant';
import { merchantFixture } from '@/stores/merchant/merchant';
import { timeout } from '@/utils';

export type GetMerchantByIdParams = {
  merchantId: string;
};

export const getMerchantById = async (
  params: GetMerchantByIdParams,
): Promise<Merchant> => {
  console.log('REQUEST::getMerchantById', params);
  await timeout(3000);
  return merchantFixture();
};

export type ListMerchantsByLocationParams = {
  latitude: string;
  longitude: string;
  offset: number;
  limit: number;
};

export const listMerchantsByLocation = async (
  params: ListMerchantsByLocationParams,
): Promise<Merchant[]> => {
  console.log('REQUEST::listMerchantsByLocation', params);
  await timeout(3000);
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => merchantFixture());
};
