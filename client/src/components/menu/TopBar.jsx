import React from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NavLink } from "react-router-dom";
import { Fragment } from 'react';
import LoginButton from '../../authentification/LoginButton';
import LogoutButton from '../../authentification/LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from './SearchBar';

function TopBar({ setSearchQuery }) {
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }
  
    return (
        <Disclosure as="nav" className="bg-gradient-to-r from-amber-700 from-5% via-stone-500 via-60% to-gray-800 to-80% fixed top-0 left-16 right-0 z-50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-4">
                               
                                {isAuthenticated && ( // Condition pour afficher le bouton uniquement si l'utilisateur est authentifié
    user.email.startsWith("admin") && ( // Condition supplémentaire pour vérifier si l'e-mail commence par "admin"
        <NavLink
            to="/addInstrumentForm"
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
            Ajouter instrument
        </NavLink>
    )
)}
                            </div>

                            <div className="flex-grow flex items-center justify-center">
                                <SearchBar onSearch={handleSearchChange} />
                            </div>

                            <div className="flex items-center space-x-4">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            type="button"
                                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                        <Menu as="div" className="relative z-50">
                                            <div>
                                                <Menu.Button className="flex items-center text-sm rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src={user.picture}
                                                        alt=""
                                                    />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <div className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}>
                                                                <div className="font-bold text-lg text-gray-800">{user.name}</div>
                                                                <div>{user.email}</div>
                                                            </div>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <div className={`block px-4 py-2 text-sm text-red-800 ${active ? 'bg-gray-100' : ''}`}>
                                                                <LogoutButton />
                                                            </div>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </>
                                ) : (
                                    <div className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                        <LoginButton />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}

export default TopBar;
