import axios, { AxiosError } from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ITransKey } from '../interfaces/TransManager.interface'
import { ITransManagerStore } from '../interfaces/TransManagerStore.interface'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const useTransManagerStore = create<ITransManagerStore>()(
    persist(
        (set) => ({
            user: {
                name: null,
                email: null
            },
            loading: false,
            error: null,
            languages: [
                { code: 'en', value: 'English' },
                { code: 'fr', value: 'French' },
                { code: 'es', value: 'Spanish' }
            ],
            selectedLanguages: [
            ],
            translationKeys: [
            ],
            updateUser: (name: string, email: string) => set({ user: { name, email } }),
            selectLanguage: (langCode: "en" | "fr" | "es") =>
                set((state) => ({
                    selectedLanguages: [...state.selectedLanguages, state.languages.find((lang) => lang.code === langCode)!],
                })),
            deselectLanguage: (langCode: "en" | "fr" | "es") =>
                set((state) => ({
                    selectedLanguages: state.selectedLanguages.filter((lang) => lang.code !== langCode),
                })),
            fetchLocalizations: async () => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.get(`${baseUrl}/localizations`);
                    set({ loading: false, translationKeys: res.data });

                    return res.data;
                } catch (e: unknown) {
                    const err = e as AxiosError;

                    set({
                        error: err.message || 'Error fetching transaltion keys',
                        loading: false,
                    })
                    throw err;
                }
            },
            fetchLocalization: async (transKeyId: string) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.get(`${baseUrl}/localizations/${transKeyId}`);
                    set({ loading: false, translationKeys: res.data });

                    return res.data;
                } catch (e: unknown) {
                    const err = e as AxiosError;

                    set({
                        error: err.message || 'Error fetching transaltion key',
                        loading: false,
                    })
                    throw err;
                }
            },
            createLocalization: async (transKey: ITransKey) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.post(`${baseUrl}/localizations`, transKey);
                    set({ loading: false });

                    return res.data;
                } catch (e: unknown) {
                    const err = e as AxiosError;

                    set({
                        error: err.message || 'Error creating transaltion key',
                        loading: false,
                    })
                    throw err;
                }
            },
            editLocalization: async (transKey: ITransKey) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.put(`${baseUrl}/localizations/${transKey.id}`, transKey);
                    set({ loading: false });

                    return res.data;
                } catch (e: unknown) {
                    const err = e as AxiosError;

                    set({
                        error: err.message || 'Error editing transaltion key',
                        loading: false,
                    })
                    throw err;
                }
            },
            deleteLocalization: async (transKeyId: string) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.delete(`${baseUrl}/localizations/${transKeyId}`);
                    set({ loading: false });

                    return res.data;
                } catch (e: unknown) {
                    const err = e as AxiosError;

                    set({
                        error: err.message || 'Error deleting transaltion key',
                        loading: false,
                    })
                    throw err;
                }
            },
        }),
        {
            name: 'trans-manager-storage',
            partialize: (state) => ({
                user: state.user,
                languages: state.languages,
                selectedLanguages: state.selectedLanguages
            }),
        }
    )
)

export default useTransManagerStore