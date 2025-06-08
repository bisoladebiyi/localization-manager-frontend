import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useLocalizations() {
  return useQuery({
    queryKey: ['localizations'],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/localizations`);
      return data;
    },
  });
}
