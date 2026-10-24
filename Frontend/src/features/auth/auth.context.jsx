import { createContext, useState, useEffect } from 'react';
import { getMe, login, register, logout } from './services/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initUser = async () => {
            try {
                const data = await getMe();
                if (data?.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initUser();
    }, []);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data?.message || "Login failed" };
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Login failed";
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data?.user) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, message: data?.message || "Registration failed" };
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed";
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
