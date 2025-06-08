import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ITransManagerStore } from '../interfaces/TransManagerStore.interface'


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
                }))
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