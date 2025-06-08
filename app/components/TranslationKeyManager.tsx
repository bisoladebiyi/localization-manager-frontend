"use client";
import { IoCheckmark } from "react-icons/io5";
import useTransManagerStore from "../store/useTransManagerStore";
import { IoMdClose } from "react-icons/io";
import React, { useState } from "react";
import TranslationKeyItem from "./TranslationKeyItem";
import toast from "react-hot-toast";
import {
  ITransKey,
  ITranslationKeyManager,
} from "../interfaces/TransManager.interface";
import { useLocalizations } from "../hooks/useLocalizations";
import { useCreateLocalization } from "../hooks/useCreateLocalization";

const TranslationKeyManager: React.FC<ITranslationKeyManager> = ({
  handleTransSearch,
  isAddNew,
  setIsAddNew,
}) => {
  const {
    selectedLanguages,
    user
  } = useTransManagerStore();

  const { data: translationKeys, refetch: fetchLocalizations } =
    useLocalizations();
  const createLocalization = useCreateLocalization();

  const [trans, setTrans] = useState({
    key: "",
    ["en"]: "",
    ["es"]: "",
    ["fr"]: "",
  });

  const addNewTranslation = async () => {
    const now = new Date().toISOString();

    const transKeyObj: ITransKey = {
      key: trans.key,
      category: "",
      description: "",
      translations: {
        ["en"]: {
          value: trans["en"],
          updatedAt: now,
          updatedBy: user?.email || user?.name || "",
        },
        ["fr"]: {
          value: trans["fr"],
          updatedAt: now,
          updatedBy: user?.email || user?.name || "",
        },
        ["es"]: {
          value: trans["es"],
          updatedAt: now,
          updatedBy: user?.email || user?.name || "",
        },
      },
    };

    createLocalization.mutate(transKeyObj, {
      onSuccess: async() => {
        await fetchLocalizations();
        setIsAddNew(false);
        toast.success("Translation key successfully created!");
      },
      onError: (error) => {
        toast.error(`${error.message || "Looks like something went wrong"}`);
        setIsAddNew(false);
        console.error(error);
      },
    });
  };

  return (
    <div className="flex flex-col">
      {/* Table header  */}
      <div className="grid grid-cols-5 border-b border-gray-200 py-4">
        <p className="font-bold text-gray-600">Key</p>
        {selectedLanguages.map((l) => (
          <p className="font-bold text-gray-600" key={l.code}>
            {l.code}
          </p>
        ))}
      </div>
      {/* Add New Translation  */}
      {isAddNew && (
        <div className="grid grid-cols-5 border-b border-gray-200 py-4">
          <input
            onChange={(e) => setTrans({ ...trans, key: e.target.value })}
            type="text"
            placeholder="Enter Key"
            className="bg-gray-100 border border-gray-300 p-2 w-3/4 rounded-md outline-0 text-sm"
          />
          {selectedLanguages.map((l) => (
            <input
              key={`${l.code}addNew`}
              type="text"
              onChange={(e) => setTrans({ ...trans, [l.code]: e.target.value })}
              placeholder={`Enter value for ${l.code}`}
              className="bg-gray-100 border border-gray-300 p-2 w-3/4 rounded-md outline-0 text-sm"
            />
          ))}
          <div className="flex items-center gap-x-3">
            <button
              data-testid="close-add-new-inputs"
              name="close"
              className="cursor-pointer"
              onClick={() => setIsAddNew(false)}
            >
              <IoMdClose />
            </button>
            <button
              data-testid="add-translation-key"
              onClick={addNewTranslation}
              className="cursor-pointer"
            >
              <IoCheckmark className="text-green-700 text-lg" />
            </button>
          </div>
        </div>
      )}
      {/* Table Body  */}
      {handleTransSearch(translationKeys)?.map((trans: ITransKey) => (
        <TranslationKeyItem key={trans.id} trans={trans} />
      ))}
    </div>
  );
};

export default TranslationKeyManager;
