import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-32 py-10 px-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <img src="/logo.png" alt="CreatorFlow AI logo" className="h-16 sm:h-20 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300" />
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 font-medium">
                <Link to="/" className="hover:text-pink-400 transition">Home</Link>
                <Link to="/generate" className="hover:text-pink-400 transition">Generate</Link>
                <Link to="/my-generation" className="hover:text-pink-400 transition">History</Link>
                <Link to="/profile" className="hover:text-pink-400 transition">Profile</Link>
            </div>

            <p className="mt-4 md:mt-0 text-xs text-zinc-600">
                &copy; {new Date().getFullYear()} CreatorFlow AI. All rights reserved.
            </p>
        </footer>
    );
}