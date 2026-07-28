        // --- MAIN APP ---
        export default function App() {
            const [currentView, setView] = useState('home');
            const [selectedFilm, setSelectedFilm] = useState(null);
            const [selectedBlog, setSelectedBlog] = useState(null);
            const [films, setFilms] = useState(CONFIG.films);
            const [blogs, setBlogs] = useState(CONFIG.blogs);
            
            const [siteConfig, setSiteConfig] = useState({
                tagline: CONFIG.brand.tagline,
                description: CONFIG.brand.description,
                featured: CONFIG.featured,
                aboutHistory: CONFIG.about.history,
                aboutVision: CONFIG.about.vision,
                aboutAwards: CONFIG.about.awards,
                aboutGallery: CONFIG.about.gallery,
                name: CONFIG.brand.name
            });

            // Theater State
            const [theaterActive, setTheaterActive] = useState(false);
            const [currentVideoId, setCurrentVideoId] = useState(null);

            useEffect(() => {
                const unsubFilms = onSnapshot(collection(db, 'films'), (snapshot) => {
                    const fbFilms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
                    // Filter out hardcoded CONFIG films if they are already in firestore by ID? Or just use fbFilms if not empty.
                    // Let's just use fbFilms. If they want to wipe the slate clean, we shouldn't show CONFIG.films.
                    setFilms(fbFilms.length > 0 ? fbFilms : CONFIG.films);
                });
                const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
                    const fbBlogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
                    setBlogs(fbBlogs.length > 0 ? fbBlogs : CONFIG.blogs);
                });
                const unsubConfig = onSnapshot(doc(db, 'config', 'main'), (doc) => {
                    if (doc.exists()) {
                        setSiteConfig(prev => ({ ...prev, ...doc.data() }));
                    }
                });
                return () => {
                    unsubFilms();
                    unsubBlogs();
                    unsubConfig();
                };
            }, []);

            useEffect(() => {
                window.scrollTo(0, 0);
            }, [currentView]);

            // Handle Play from Modal
            const handlePlay = (videoId) => {
                setCurrentVideoId(videoId);
                setTheaterActive(true);
            };

            const closeTheater = () => {
                setTheaterActive(false);
                setTimeout(() => setCurrentVideoId(null), 1500); // Wait for curtain to lift
            };

            return (
                <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-[#FF3366] selection:text-white">
                    <style>{styles}</style>
                    <Navigation currentView={currentView} setView={setView} siteConfig={siteConfig} />
                    
                    {currentView === 'home' && (
                        <HomeView 
                            setView={setView} 
                            openFilm={setSelectedFilm} 
                            openBlog={setSelectedBlog} 
                            films={films}
                            blogs={blogs}
                            siteConfig={siteConfig}
                        />
                    )}
                    
                    {currentView === 'films' && <FilmsView openModal={setSelectedFilm} films={films} />}
                    {currentView === 'blog' && <BlogView openModal={setSelectedBlog} blogs={blogs} />}
                    {currentView === 'about' && <AboutView siteConfig={siteConfig} />}
                    {currentView === 'admin' && <AdminView films={films} blogs={blogs} siteConfig={siteConfig} />}

                    <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} onPlay={handlePlay} />
                    <BlogModal post={selectedBlog} onClose={() => setSelectedBlog(null)} />
                    
                    {/* The Global Overlay */}
                    <TheaterOverlay isActive={theaterActive} videoId={currentVideoId} onClose={closeTheater} />
                    
                    <footer className="py-12 px-6 border-t border-gray-900 mt-20 text-center md:text-left">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs font-mono uppercase tracking-widest">
                            <div className="mb-4 md:mb-0">
                                <span className="text-white font-bold">{siteConfig.name}</span> © {new Date().getFullYear()}
                            </div>
                            <div className="flex gap-8">
                                <button onClick={() => setView('admin')} className={`hover:text-white transition-colors ${currentView === 'admin' ? 'text-white' : ''}`}>Admin</button>
                            </div>
                        </div>
                    </footer>
                </div>
            );
        }
