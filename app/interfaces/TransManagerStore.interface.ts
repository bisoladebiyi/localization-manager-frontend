import { ILanguage, ITransKey } from "./TransManager.interface"

export interface ITransManagerStore {
    user: {
        email: string | null
        name: string | null
    }
    languages: ILanguage[]
    selectedLanguages: ILanguage[]
    translationKeys: ITransKey[]
    loading: boolean
    error: string | null
    updateUser: (name: string, email: string) => void
    selectLanguage: (langCode: "en" | "fr" | "es") => void,
    deselectLanguage: (langCode: "en" | "fr" | "es") => void
}