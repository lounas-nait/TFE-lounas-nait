import React, { useState, useEffect, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from '../../authentification/LogoutButton';
import LoginButton from '../../authentification/LoginButton';
import SearchBar from './SearchBar'; // Importez SearchBar ici
import InstrumentDetail from '../instrumentsList/InstrumentDetail';
import handleUpdate from '../../functions/HandleUpdate';
import { useNotification } from '../context/NotificationContext';
import ms from "../../images/ms.png";
import ResetPassword from '../ResetPassword';
import { BsExclamationTriangleFill } from 'react-icons/bs';

function TopBar({ setSearchQuery }) {
    const { getAccessTokenSilently, user, isAuthenticated, isLoading } = useAuth0();
    const [updatedQuantiteEnStock, setUpdatedQuantiteEnStock] = useState(0);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [notificationList, setNotificationList] = useState([]);
    const [openNotification, setOpenNotification] = useState(false);
    const { notificationCount, updateNotificationCount } = useNotification();
    const [quantite, setQuantite] = useState(1);
    const [updatedPrixTVA, setUpdatedPrixTVA] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/instruments?size=1000');
                const instruments = await response.json();
                const stockBasOrRupture = instruments.content.filter(instrument => instrument.quantiteEnStock <= 0 || instrument.quantiteEnStock <= 3);
                setNotificationList(stockBasOrRupture);
                updateNotificationCount(stockBasOrRupture.length);
            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error);
            }
        };

        const interval = setInterval(() => {
            fetchNotifications();
        }, 600);

        return () => clearInterval(interval);
    }, [updateNotificationCount]);

    const handleInstrumentClick = (instrument) => {
        setSelectedInstrument(instrument);
        setOpenNotification(false);
        setQuantite(1);
        setUpdatedQuantiteEnStock(instrument.quantiteEnStock);
        setUpdatedPrixTVA(instrument.prixTVA);
    };

    const handleUpdatedQuantiteChange = (e) => {
        setUpdatedQuantiteEnStock(parseInt(e.target.value, 10));
    };

    const handleQuantiteChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setQuantite(value);
    };

    const handleUpdatedPriceChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setUpdatedPrixTVA(value);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    const searchURL = `/api/instruments?size=1000`;

    const handleUpdateInstrument = async () => {
        try {
            await handleUpdate(
                selectedInstrument,
                updatedQuantiteEnStock,
                updatedPrixTVA,
                getAccessTokenSilently,
                searchURL,
                setSelectedInstrument
            );
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'instrument:', error);
        }
    };

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    const isAdmin = isAuthenticated && user.email.startsWith('lounas.nait960');

    // Vérification si vous êtes sur la page d'accueil
    const isHomePage = window.location.pathname === '/'; // Adapter le chemin selon votre routage

    return (
        <>
            <Disclosure as="nav" className="bg-gradient-to-r  from-gray-700 from-5% via-stone-500 via-60% to-amber-800 to-80% fixed top-0 left-16 right-0 z-50">
                {({ open }) => (
                    <>
                        <div>
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img src={ms} alt="" className='h-10 w-50' />
                                </div>

                                {isHomePage && ( // Afficher SearchBar uniquement sur la page d'accueil
                                    <div className="flex-grow flex items-center justify-center">
                                        <SearchBar onSearch={handleSearchChange} />
                                    </div>
                                )}

                                <div className="flex items-center space-x-6 mr-4">
                                    {isAuthenticated ? (
                                        <>
                                            {isAdmin && (
                                                <Menu as="div" className="relative z-50">
                                                    <Menu.Button className="flex items-center text-sm rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                                                        type="button"
                                                        onClick={() => setOpenNotification(!openNotification)}>
                                                        <div className="relative">
                                                            <span className="sr-only">View notifications</span>
                                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                            {notificationCount > 0 && (
                                                                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notificationCount}</span>
                                                            )}
                                                        </div>
                                                    </Menu.Button>
                                                    <Transition
                                                        show={openNotification}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-80 overflow-y-auto">
                                                            {notificationList.length > 0 ? (
                                                                notificationList.map((notification, index) => (
                                                                    <Menu.Item key={index}>
                                                                        {({ active }) => (
                                                                            <div
                                                                                className={`block px-4 py-2 w-60 text-sm cursor-pointer ${active ? 'bg-yellow-200' : ''}`}
                                                                                onClick={() => handleInstrumentClick(notification)}
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <img
                                                                                        key={index}
                                                                                        src={notification.images[0].url}
                                                                                        className="w-10 h-10 object-cover cursor-pointer border-2 border-gray-400 hover:border-stone-700 focus:outline-none rounded-md"
                                                                                        alt={notification.nom}
                                                                                    />
                                                                                    <span>{notification.nom} il reste {notification.quantiteEnStock} en stock</span>
                                                                                    <BsExclamationTriangleFill className="h-12 w-12 text-red-500" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))
                                                            ) : (
                                                                <div className="block px-4 py-2 text-sm">
                                                                    Pas de notifications
                                                                </div>
                                                            )}
                                                        </Menu.Items>

                                                    </Transition>
                                                </Menu>
                                            )}
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
                                                    <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <div className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}>
                                                                    <div className="flex items-center space-x-2">
                                                                        <img
                                                                            className="h-8 w-8 rounded-full"
                                                                            src={user.picture}
                                                                            alt=""
                                                                        />
                                                                        <span className="font-bold text-lg text-gray-800">{user.nickname}</span>
                                                                    </div>
                                                                    <div>{user.email}</div>
                                                                </div>
                                                            )}
                                                        </Menu.Item>

                                                        <Menu.Item>
                                                            <div className="block px-4 py-2 text-sm text-blue-700">
                                                                <ResetPassword />
                                                            </div>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <div className="block px-4 py-2 text-sm text-red-700">
                                                                <LogoutButton />
                                                            </div>
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

            {selectedInstrument && (
                <InstrumentDetail
                    selectedInstrument={selectedInstrument}
                    handleCloseDetails={() => setSelectedInstrument(null)}
                    isAdmin={isAuthenticated && user.email.startsWith('lounas.nait960')}
                    handleQuantityChange={handleQuantiteChange}
                    handleUpdatedQuantiteChange={handleUpdatedQuantiteChange}
                    handleUpdateInstrument={handleUpdateInstrument}
                    updatedQuantiteEnStock={updatedQuantiteEnStock}
                    updatedPrixTVA={updatedPrixTVA}
                    handleUpdatedPriceChange={handleUpdatedPriceChange}
                />
            )}
        </>
    );
}

export default TopBar;
