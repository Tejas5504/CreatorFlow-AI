import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/' className="relative inline-flex items-center">
                    {/* Soft creamy white spotlight behind the logo, adjusted for the 2x scale */}
                    <div className="absolute top-1/2 left-[100%] -translate-x-1/2 -translate-y-1/2 w-[250%] h-[150%] bg-[#fffdf0]/40 blur-[25px] rounded-[100%] -z-10 pointer-events-none"></div>
                    <img src="/logo.png" alt="logo" className="relative h-10 sm:h-12 w-auto object-contain scale-[1.7] sm:scale-[2] origin-left translate-y-1 sm:translate-y-2 transition-transform duration-300"></img>
                </Link>
                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-pink-300 transition" >Home</Link>
                    <Link to='/generate' className="hover:text-pink-300 transition" >Generate</Link>
                    <Link to='/my-generation' className="hover:text-pink-300 transition" >My Generations</Link>
                    <Link to='/profile' className="hover:text-pink-300 transition" >My Profile</Link>
                </div>

                {!loading && (
                    user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-white/80 text-sm">Hi, <span className="text-pink-400 font-medium">{user.name}</span></span>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full text-sm border border-white/15"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
                            Get Started!
                        </button>
                    )
                )}

                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={() => setIsOpen(false)} to='/'>Home</Link>
                <Link onClick={() => setIsOpen(false)} to='/generate'  >Generate</Link>
                <Link onClick={() => setIsOpen(false)} to='/my-generations'  >My Generations</Link>
                <Link onClick={() => setIsOpen(false)} to='/profile'  >My Profile</Link>
                {user ? (
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-pink-400">Logout</button>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/login'>Login</Link>
                )}
                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}