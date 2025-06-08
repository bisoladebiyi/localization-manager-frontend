import React from "react"
import { IToolbar } from "../interfaces/TransManager.interface"

const Toolbar: React.FC<IToolbar> = ({ searchVal, setSearchVal, isAddNew, setIsAddNew}) => {
  return (
    <div className="w-full flex items-center gap-x-4">
        <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} className="bg-gray-100 border border-gray-300 p-2 w-3/4 rounded-md outline-0" type="text" placeholder="Search Translations" />
        {!isAddNew && <button onClick={() => setIsAddNew(true)} className="text-sm text-white bg-gray-900 rounded p-2 cursor-pointer hover:bg-black w-1/4">Add New Translation</button>}
    </div>
  )
}

export default Toolbar