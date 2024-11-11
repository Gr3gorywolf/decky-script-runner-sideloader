import { getScripts } from '@/Api/endpoints/scriptsApi';
import { useQuery } from 'react-query';

export const SCRIPTS_QUERY_KEY = 'scripts-fetch';

export const useGetScripts = (isConnected: boolean) => {
  return useQuery(
    SCRIPTS_QUERY_KEY,
    async () => {
      const data = await getScripts();
      return data.data;
    },
    {
      refetchInterval: 10 * 1000,
      enabled: isConnected,
    }
  );
};
