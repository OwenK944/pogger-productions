with open('script.jsx', 'r') as f:
    content = f.read()

archives_code = """
        const ArchivesView = ({ openModal, films, siteConfig }) => {
            const [user, setUser] = useState(null);
            useEffect(() => {
                const unsub = onAuthStateChanged(auth, u => setUser(u));
                return () => unsub();
            }, []);

            const handleLogin = async () => {
                try {
                    await signInWithPopup(auth, googleProvider);
                } catch(e) { alert(e.message); }
            };

            const allowedEmails = Array.isArray(siteConfig.allowedArchiveEmails) ? siteConfig.allowedArchiveEmails : (siteConfig.allowedArchiveEmails||'').split('\\n').map(e=>e.trim()).filter(Boolean);
            const isAuthorized = user && (user.email === 'owen.klea@gmail.com' || allowedEmails.includes(user.email));

            if (!user || !isAuthorized) {
                return (
                    <div className="min-h-screen pt-32 px-6 flex items-center justify-center animate-fade-in">
                        <div className="bg-[#111] p-8 rounded-lg border border-gray-800 w-full max-w-md text-center">
                            <h2 className="font-display text-3xl text-white mb-6">Archives Access</h2>
                            <p className="text-gray-400 mb-8 text-sm">Please sign in with an authorized Google account to view archived productions.</p>
                            {!user ? (
                                <button onClick={handleLogin} className="w-full bg-white text-black font-bold p-4 rounded hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm flex justify-center items-center gap-2">
                                    Sign In with Google
                                </button>
                            ) : (
                                <div>
                                    <p className="text-red-500 text-sm mb-4">Account {user.email} is not authorized.</p>
                                    <button onClick={() => signOut(auth)} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm">
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            const archivedFilms = films.filter(f => f.archived);

            return (
                <div className="min-h-screen pt-32 pb-20 animate-fade-in">
                    <div className="px-6 max-w-7xl mx-auto mb-16 flex justify-between items-end">
                        <div>
                            <h1 className="font-display text-3xl font-bold text-white mb-2">The Archives</h1>
                            <p className="text-gray-400 text-sm">Authorized viewing only. Welcome, {user.email}</p>
                        </div>
                        <button onClick={() => signOut(auth)} className="text-[var(--accent)] hover:text-white text-sm uppercase tracking-widest font-bold">Sign Out</button>
                    </div>
                    {archivedFilms.length === 0 ? (
                        <div className="px-6 max-w-7xl mx-auto text-gray-400">No archived films available.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
                            {archivedFilms.map((film, i) => (
                                <div key={film.id} className="group cursor-pointer" onClick={() => openModal(film)}>
                                    <div className="relative aspect-video overflow-hidden rounded-sm mb-4 border border-gray-800 group-hover:border-[var(--accent)] transition-colors">
                                        <img src={film.image} alt={film.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="bg-[var(--accent)] text-white p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                                <Play fill="currentColor" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white text-lg group-hover:text-[var(--accent)] transition-colors">{film.title}</h3>
                                            <p className="text-sm text-gray-400 font-mono mt-1">{film.category}</p>
                                        </div>
                                        <span className="text-xs text-[var(--accent)] font-mono border border-[var(--accent)]/30 px-2 py-1 rounded-sm">{film.releaseDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        };
"""

content = content.replace("export default function App() {", archives_code + "\n        export default function App() {")

with open('script.jsx', 'w') as f:
    f.write(content)
