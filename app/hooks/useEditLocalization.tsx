import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ITransKey } from '../interfaces/TransManager.interface';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useEditLocalization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transKey: ITransKey) => {
      const { data } = await axios.put(`${baseUrl}/localizations/${transKey.id}`, transKey);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizations'] });
    },
  });
}
