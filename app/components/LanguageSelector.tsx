"use client";
import useTransManagerStore from "../store/useTransManagerStore";

const LanguageSelector = () => {
  const { languages, selectedLanguages, selectLanguage, deselectLanguage } =
    useTransManagerStore();
  const selectedLangCodes = selectedLanguages.map((lang) => lang.code);

  const toggleLangSelection = (langCode: "en" | "fr" | "es") => {
    if (selectedLangCodes.includes(langCode)) {
      deselectLanguage(langCode);
    } else {
      selectLanguage(langCode);
    }
  };

  return (
    <ul className="max-h-96 overflow-auto flex flex-col gap-y-1">
      {languages.map((l) => (
        <li
          onClick={() => toggleLangSelection(l.code)}
          className={`p-3 cursor-pointer hover:bg-gray-100 rounded-md ${
            selectedLangCodes.includes(l.code) ? "bg-gray-100" : ""
          }`}
          key={l.code}
        >
          {l.value} ({l.code})
        </li>
      ))}
    </ul>
  );
};

export default LanguageSelector;
