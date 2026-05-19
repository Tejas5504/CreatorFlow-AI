import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface IUser {
    _id: string;
    name: string;
    email: string;
}

interface IAuthContext {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Verify session on app load
    useEffect(() => {
        const verifySession = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/auth/verify", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch {
                // Not logged in or server unavailable
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // ignore
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
