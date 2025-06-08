import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import useTransManagerStore from "../store/useTransManagerStore";
import { deepEqual } from "../utils/helpers";
import toast from "react-hot-toast";
import { ILanguage, ITransKey, ITranslationKeyItem } from "../interfaces/TransManager.interface";

const TranslationKeyItem:React.FC<ITranslationKeyItem> = ({ trans }) => {
  const [transState, setTransState] = useState<ITransKey>(trans);
  const {
    selectedLanguages,
    error,
    deleteLocalization,
    fetchLocalizations,
    editLocalization,
  } = useTransManagerStore();

  const deleteTranslation = async () => {
    try {
      await deleteLocalization(trans.id ?? "");
      await fetchLocalizations();
      toast.success("Translation key successfully deleted!");
    } catch (e: unknown) {
      console.log(e, "hiii");
      toast.error(`${error || "Looks like something went wrong"}`);
    }
  };

  const onTransStateChange = (e: React.ChangeEvent<HTMLInputElement>, key: boolean, code?: string) => {
    const now = new Date().toISOString();

    setTransState((prev: ITransKey) => ({
      ...prev,
      ...(key && { key: e.target.value }),
      ...(code && {
        translations: {
          ...prev.translations,
          [code]: {
            value: e.target.value,
            updatedAt: now,
            updatedBy: "",
          },
        },
      }),
    }));
  };

  const updateTranslation = async () => {
    if (deepEqual(transState, trans)) return;

    try {
      await editLocalization(transState);
      await fetchLocalizations();
      toast.success("Translation key successfully updated!");
    } catch (e: unknown) {
      console.log(e);
      toast.error(`${error || "Looks like something went wrong"}`);
    }
  };
  return (
    <div
      className="grid grid-cols-5 border-b border-gray-200 py-4"
      key={trans.id}
    >
      <input
        onBlur={updateTranslation}
        onChange={(e) => onTransStateChange(e, true)}
        className="text-cyan-600 font-mono font-medium focus:bg-gray-100 focus:border focus:border-gray-300 focus:p-2 w-3/4 rounded-md outline-0"
        value={transState.key}
      />
      {selectedLanguages.map((l: ILanguage) => (
        <input
          onBlur={updateTranslation}
          onChange={(e) => onTransStateChange(e, false, l.code)}
          className="focus:bg-gray-100 focus:border focus:border-gray-300 focus:p-2 w-3/4 rounded-md outline-0"
          key={`${l.code}${trans.translations[l.code]?.value}`}
          value={transState.translations[l.code]?.value}
          placeholder="--"
        />
      ))}
      <div className="flex items-center gap-x-3">
        <button className="cursor-pointer" onClick={deleteTranslation}>
          <IoCloseCircle className="text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default TranslationKeyItem;
