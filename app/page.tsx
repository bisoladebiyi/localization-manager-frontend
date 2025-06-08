"use client"
import { IoPersonCircleSharp } from "react-icons/io5";
import TranslationKeyManager from "./components/TranslationKeyManager";
import LanguageSelector from "./components/LanguageSelector";
import Toolbar from "./components/Toolbar";
import { useEffect, useState } from "react";
import useTransManagerStore from "./store/useTransManagerStore";
import { Toaster } from "react-hot-toast";
import { ITransKey } from "./interfaces/TransManager.interface";

export default function Home() {
  const [ searchVal, setSearchVal ] = useState<string>("");
  const [ isAddNew, setIsAddNew ] = useState<boolean>(false);
   const {
    user, updateUser
  } = useTransManagerStore();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) return;

    if(!user.email && !user.name) {
      const name = prompt("Please enter your name") || "";
      const email = prompt("Please enter your email") || "";

      updateUser(name, email)
    }

  },[user, updateUser])

  const handleTransSearch = (transKeysList: ITransKey[]) => {
    const searchValLower = searchVal.toLowerCase();

    return transKeysList.filter((trans: ITransKey) => {
      if (trans.key.toLowerCase().includes(searchValLower)) return true;

      return Object.values(trans.translations).some((translation) =>
        translation.value.toLowerCase().includes(searchValLower)
      );
    });
  }
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-[family-name:var(--font-geist-sans)]">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {/* Header */}
      <header className="bg-white dark:bg-stone-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-stone-700 dark:text-stone-200">
                Helium
              </span>
            </div>
            <nav className="flex items-center space-x-1">
              {/* User Profile / Authentication Status */}
              <IoPersonCircleSharp className="text-2xl text-gray-500" />
              <p>{user?.name}</p>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Layout (Sidebar + Content Area) */}
      <div className="flex flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar */}
        <aside className="w-1/4 xl:w-1/5 p-4 bg-white dark:bg-stone-800 shadow rounded-lg mr-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-stone-700 dark:text-stone-300">
              Languages
            </h2>
            {/* Language Selector Component */}
            <LanguageSelector />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-3/4 xl:w-4/5 flex flex-col space-y-6">
          {/* Toolbar Area */}
          <div className="bg-white dark:bg-stone-800 shadow rounded-lg p-4 flex items-center justify-between min-h-[60px]">
            {/* Toolbar Component (e.g., Search, Add Key Button) */}
            <Toolbar searchVal={searchVal} setSearchVal={setSearchVal} isAddNew={isAddNew} setIsAddNew={setIsAddNew} />
          </div>

          {/* Translation Keys List / Editor Area */}
          <section className="flex-grow bg-white dark:bg-stone-800 shadow rounded-lg p-4 lg:p-6">
            <h2 className="text-xl font-semibold mb-4 text-stone-700 dark:text-stone-300">
              Translation Management Area
            </h2>
            {/* Translation Key List & Editor Component */}
              <TranslationKeyManager handleTransSearch={handleTransSearch} isAddNew={isAddNew} setIsAddNew={setIsAddNew} />
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>&copy; {new Date().getFullYear()} Helium Contractor Assignment. Good luck!</p>
          <div className="mt-1">
            <a href="#" className="hover:underline mx-2">Documentation (Placeholder)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
