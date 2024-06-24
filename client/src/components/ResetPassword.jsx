import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function ResetPassword() {
    const { user, getAccessTokenSilently, logout } = useAuth0();
    const [resetPasswordSent, setResetPasswordSent] = useState(false);
    const [error, setError] = useState(null);

    const handleChangePassword = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            const connection = 'Username-Password-Authentication';
            const changePasswordURL = `https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/change_password?client_id=${import.meta.env.VITE_AUTH0_CLIENT_ID}&email=${user.email}&connection=${connection}`;

            // Ouvrir le lien dans un nouvel onglet
            window.open(changePasswordURL, '_blank');

            // Mettre à jour l'état pour indiquer que le lien a été ouvert
            setResetPasswordSent(true);
        } catch (error) {
            console.error('Failed to change password:', error);
            setError('Failed to change password');
        }
    };

    useEffect(() => {
        if (resetPasswordSent) {
            // Déconnexion après un délai de 5 secondes pour permettre l'envoi de l'e-mail de réinitialisation
            setTimeout(() => {
                logout({ returnTo: window.location.origin });
            }, 5000);
        }
    }, [resetPasswordSent, logout]);

    return (
        <div>
            <button onClick={handleChangePassword}>
                Changer le mot de passe
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default ResetPassword;
