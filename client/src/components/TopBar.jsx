import React from 'react';
import SearchBar from './SearchBar';
import { Disclosure } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NavLink } from "react-router-dom";

function TopBar({ setSearchQuery }) {
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    return (
        <Disclosure as="nav" className="bg-gradient-to-r from-amber-700 from-5% via-stone-500 via-60% to-gray-800 to-80% ...">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="hidden sm:block sm:ml-6">
                                    <div className="flex space-x-4">
                                      <NavLink
                                            to="/"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            Categories
                                        </NavLink>
                                        <NavLink
                                           to="/addInstrumentForm"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            Ajouter instrumentt
                                        </NavLink>
                                  </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <SearchBar onSearch={handleSearchChange} />
                                <button
                                    type="button"
                                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ml-2"
                                >
                                    <span className="absolute -inset-2" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}

export default TopBar
