import { Dispatch, SetStateAction } from "react"

export interface ITransKey {
    id?: string,
    key: string,
    category: string,
    description: string,
    translations: {
        ["en"]: {
            value: string,
            updatedAt: string,
            updatedBy: string
        },
        ["fr"]: {
            value: string,
            updatedAt: string,
            updatedBy: string
        },
        ["es"]: {
            value: string,
            updatedAt: string,
            updatedBy: string
        },
    }
}

export interface ILanguage {
    code: "en" | "fr" | "es",
    value: string
}

export interface ITranslationKeyManager {
    handleTransSearch: (transKeysList: ITransKey[]) => ITransKey[],
    isAddNew: boolean,
    setIsAddNew: Dispatch<SetStateAction<boolean>>,
}

export interface ITranslationKeyItem {
    trans: ITransKey
}

export interface IToolbar {
    searchVal: string,
    isAddNew: boolean,
    setSearchVal: Dispatch<SetStateAction<string>>,
    setIsAddNew: Dispatch<SetStateAction<boolean>>,
}
