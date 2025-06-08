import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useLocalization(id: string) {
  return useQuery({
    queryKey: ['localization', id],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/localizations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
