// --- YOUR EXACT CODE STARTS HERE ---
        import React, { useState, useEffect, useRef } from 'react';
        import { Play, X, Grid, Monitor, Search, Award, ChevronRight, ChevronLeft, Menu, Filter, Clock, MapPin, Palette, Aperture, Mic, Film, FileText, Calendar, Laptop, Hourglass, Layers, Upload, Plus, Trash2, LogOut, Check } from 'lucide-react';
        import { initializeApp } from 'firebase/app';
        import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, addDoc, onSnapshot, updateDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
        import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
        import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
        import { marked } from 'marked';
        

        const firebaseConfig = {
            projectId: "gen-lang-client-0107832514",
            appId: "1:1054602715097:web:f0a9d5c47a405fc61803c8",
            apiKey: "AIzaSyCjcNJqKllXv2LKeOEUJ5XdAU-__NuItok",
            authDomain: "gen-lang-client-0107832514.firebaseapp.com",
            storageBucket: "gen-lang-client-0107832514.firebasestorage.app",
            firestoreDatabaseId: "ai-studio-poggerproduction-3a0e6021-359c-42a3-9754-7c248e6b8732",
            messagingSenderId: "1054602715097"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
        const auth = getAuth(app);
        const storage = getStorage(app);
        const googleProvider = new GoogleAuthProvider();

        enableIndexedDbPersistence(db).catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
            } else if (err.code == 'unimplemented') {
                console.warn('The current browser does not support all of the features required to enable persistence');
            }
        });

        // --- CONFIGURATION START ---
        // EDIT THIS SECTION TO ADD YOUR FILMS
        const CONFIG = {
            brand: {
                name: "Pogger Productions",
                tagline: "An Alternate Reality 80s Dystopia",
                description: "We want to push the limits of filmmaking no matter the task - from bank heists to 80s dystopias. We exist to make films fun again."
            },
            featured: "lightfall", // Matches the ID of a film or blog below
            
            about: {
                history: "Founded by Owen K during his freshman year at a small private school, Pogger Productions was started to push the limits of short films. We wanted to make things that felt like memories — grainy, loud, and full of heart. Now, we're pushing closer and closer to feature length films, and changing the boundries for short films as well.",
                vision: "The 'Pogger' in Pogger Productions started as an inside joke, and then it stuck. To us, 'Pogger' describes someone who is rad... rad enough to make films the way we do. Now, the 'Pog' branding has spread across all of Owen K's projects, from YouTube to product sales.",
                stats: [
                    { label: "Films Produced", value: "4" },
                    { label: "Awards Won", value: "7" },
                    { label: "Years Active", value: "10+" },
                    { label: "Videos Produced", value: "82+" }
                ],
                gallery: [
                    "assets/Screenshot 2026-02-09 200659.png",
                    "assets/Screenshot 2026-02-09 200611.png",
                    "assets/Screenshot 2026-02-09 200552.png",
                    "assets/Screenshot 2026-02-09 200511.png",
                    "assets/Screenshot 2026-02-09 200502.png",
                    "assets/Screenshot 2026-02-09 200445.png"
                ],
                awards: [
                    "Best Director - ODCS Film Fest 2025",
                    "Best Editor - ODCS Film Fest 2025",
                    "Audience Choice - ODCS Film Fest 2025",
                    "Best Actor - ODCS Film Fest 2025",
                    "Film of the Year - ODCS Film Fest 2026",
                    "Audience Favorite - ODCS Film Fest 2026",
                    "Actor of the Year - ODCS Film Fest 2026",
                    "Best Director - ODCS Film Fest 2026",
                    "Best Cinematography - ODCS Film Fest 2026",
                    "Best Screenplay - ODCS Film Fest 2026",
                    "Best Audio - ODCS Film Fest 2026"
                ]
            },
            films: [
                 {
                    id: "lightfall",
                    title: "Lightfall",
                    tagline: "An action packed 80s dystopia.",
                    category: "Narrative",
                    tags: ["Retro", "Action", "Practical"],
                    releaseDate: "5/15/2026",
                    rating: "PG",
                    runtime: "30m 0s",
                    image: "assets/Screenshot 2026-05-18 201135.png",
                    youtubeId: "dGIMvgWVvF4", 
                    extraFeature: { id: "q4BMzSQ4dts", label: "Watch Trailer" },
                    description: "In an alternate reality 80s dystopia where the Cold War is on the verge of conflict and the government is taking control, Scott Steele and Eric Jensen must earn enough Cred to get into the 'Safe Cities' built by the government.",
                    directorNote: "Lightfall was an impossible production that was scaled down to be filmed in a month, and I don't think it could have turned out better.",
                    keyCredits: [
                        { role: "Director, & DOP", name: "Owen K" },
                        { role: "Lead Actor", name: "Owen W" },
                        { role: "Supporting Actor", name: "Robby N" },
                        { role: "Editor", name: "Owen K" },
                        { role: "Assistant Director", name: "Jack P" },
                        { role: "Sound Design", name: "Sam M" },
                        { role: "Assistant Sound Design", name: "Garrett F" }
                    ],
                    // Location is now integrated here for the list view
                    techSpecs: {
                        location: "Ohio",
                        camera: "Blackmagic Studio Camera G2",
                        lens: "Lumix MFT OIS Zoom",
                        aspectRatio: "16:9",
                        audio: "Dolby Digital Stereo",
                        software: "Premiere Pro",
                        productionTime: "2 Months"
                    },
                    awards: ["Film of the Year - ODCS Film Fest 2026", "Best Actor - ODCS Film Fest 2026", "Audience Favorite - ODCS Film Fest 2026", "Best Director - ODCS Film Fest 2026", "Best Editor - ODCS Film Fest 2026", "Best Cinematography - ODCS Film Fest 2026", "Best Screenplay - ODCS Film Fest 2026", "Best Audio - ODS Film Fest 2026"]
                },
                {
                    id: "period8",
                    title: "Period 8",
                    tagline: "The mind of one man, the discovery of a thousand.",
                    category: "Narrative",
                    tags: ["Sci-Fi", "CGI", "Suspense"],
                    releaseDate: "4/12/2025",
                    rating: "PG",
                    runtime: "26m 30s",
                    image: "assets/Screenshot 2026-02-09 201710.png",
                    youtubeId: "dYyohfVoGgs", 
                    extraFeature: { id: "xc30C4uKbdc", label: "Watch Trailer" },
                    description: "A young man named Alex Block sets off for another day at his district's school, until things with his brain chip start going sideways. Soon, Alex finds himself in a battle for reality.",
                    directorNote: "Period 8 was a film we thought we could never pull off. After taking inspiration from films such as Nonstop and planning out the Period 8 universe, we knew we had something special in our hands.",
                    keyCredits: [
                        { role: "Director & DOP", name: "Owen K" },
                        { role: "Lead Actor", name: "Isaiah D" },
                        { role: "Editor", name: "Owen K" },
                        { role: "Set Design", name: "Robby N" },
                        { role: "Sound Design", name: "Richard W" }
                    ],
                    // Location is now integrated here for the list view
                    techSpecs: {
                        location: "ODCS, Elyria OH",
                        camera: "Blackmagic PCC6K-EF",
                        lens: "Tamron Aspherical LD",
                        aspectRatio: "16:9",
                        audio: "Dolby Digital 5.1",
                        software: "Premiere Pro",
                        productionTime: "8 Months"
                    },
                    awards: ["Best Director - ODCS Film Fest 2025", "Best Actor - ODCS Film Fest 2025", "Best Editor - ODCS Film Fest 2025", "Audience Choice - ODCS Film Fest 2025"]
                },
                {
                    id: "deadbolt",
                    title: "Dead Bolt",
                    tagline: "Heist of the century, man of the day.",
                    category: "Narrative",
                    tags: ["Comedy", "Action"],
                    releaseDate: "4/15/2024",
                    rating: "PG",
                    runtime: "16m 10s",
                    image: "assets/Screenshot 2026-02-09 203507.png",
                    youtubeId: "WZYgG5iblfA", 
                    extraFeature: {id: "3aAO316TS2Y", label: "Watch Trailer" },
                    description: "A man named Robin D. Banks is found broke and evicted, so he turns to the only reasonable source of money.",
                    directorNote: "This was our very first feature film. We were new and learning, and Dead Bolt, while rough, would set the foundation for future award winning films like Period 8.",
                    keyCredits: [
                        { role: "Director & Editor", name: "Owen K" },
                        { role: "Lead Actor", name: "Owen W" },
                        { role: "DOP", name: "Liam B" },
                        { role: "Audio Engineer", name: "Zane P" }
                    ],
                    techSpecs: { 
                        location: "ODCS, Elyria OH",
                        camera: "Canon XA20", 
                        lens: "Internal", 
                        aspectRatio: "16:9", 
                        audio: "Stereo",
                        software: "Hitfilm Express",
                        productionTime: "8 Months"
                    },
                    awards: []
                },
                {
                    id: "lightfalldoc",
                    title: "The Making of Lightfall",
                    tagline: "Making our greatest hit yet.",
                    category: "Documentary",
                    tags: ["Documentary", "Highlights"],
                    releaseDate: "5/15/2026",
                    rating: "G",
                    runtime: "5m 26s",
                    image: "assets/Screenshot 2026-05-18 205509.png",
                    youtubeId: "tGHcD8Ja8IY", 
                    description: "Lightfall was our first Film of the Year, and this documentary gives you a glimpse of what it takes to pull off a film like this.",
                    directorNote: "Somehow, managing a chaotic student film crew as the assistant/documentary director resulted in more tears of laughter than actual footage, but we still made a movie we're incredibly proud of.",
                    keyCredits: [
                        { role: "Director", name: "Jack P" },
                        { role: "Editor", name: "Owen K" },
                        { role: "DOP", name: "Jack P" },
                        { role: "Audio Engineer", name: "Sam M" }
                    ],
                    techSpecs: { 
                        location: "Ohio",
                        camera: "Nothing Phone (3)", 
                        lens: "Internal", 
                        aspectRatio: "16:9", 
                        audio: "Stereo",
                        software: "Premiere Pro",
                        productionTime: "1 Month"
                    },
                    awards: []
                },
                {
                    id: "period8doc",
                    title: "The Making of Period 8",
                    tagline: "The film that swept the stage.",
                    category: "Documentary",
                    tags: ["Documentary", "Highlights"],
                    releaseDate: "4/15/2025",
                    rating: "G",
                    runtime: "1m 42s",
                    image: "assets/Screenshot 2026-02-09 204901.png",
                    youtubeId: "fp9bbW5395U", 
                    description: "Period 8 shook up the film festival, and this video demonstrates just a taste of what it took to make it.",
                    directorNote: "Directing the documentary for Period 8 was an awesome experience, and it's crazy what can be accomplished.",
                    keyCredits: [
                        { role: "Director", name: "Owen W" },
                        { role: "Editor", name: "Owen K" },
                        { role: "DOP", name: "Owen W" },
                        { role: "Audio Engineer", name: "Owen W" }
                    ],
                    techSpecs: { 
                        location: "ODCS, Elyria OH",
                        camera: "Nothing Phone (1)", 
                        lens: "Internal", 
                        aspectRatio: "16:9", 
                        audio: "Stereo",
                        software: "Premiere Pro",
                        productionTime: "3 Months"
                    },
                    awards: []
                },
                {
                    id: "deadboltdoc",
                    title: "The Making of Dead Bolt",
                    tagline: "A fan favorite documentary.",
                    category: "Documentary",
                    tags: ["Documentary", "Highlights"],
                    releaseDate: "4/20/2024",
                    rating: "G",
                    runtime: "5m 8s",
                    image: "assets/Screenshot 2026-02-09 210226.png",
                    youtubeId: "P0HisCyTN_8", 
                    description: "Our very first feature film, Dead Bolt, was a crucial foundation to our studio. The documentary revealed the process of filmmaking to the world.",
                    directorNote: "Dead Bolt was a fun film. A little goofy, but fun.",
                    keyCredits: [
                        { role: "Director", name: "Kai D" },
                        { role: "Editor", name: "Owen K" },
                        { role: "DOP", name: "Kai D" },
                        { role: "Audio Engineer", name: "Zane P" }
                    ],
                    techSpecs: { 
                        location: "ODCS, Elyria OH",
                        camera: "Nothing Phone (1)", 
                        lens: "Internal", 
                        aspectRatio: "16:9", 
                        audio: "Stereo",
                        software: "Premiere Pro",
                        productionTime: "3 Months"
                    },
                    awards: []
                }
            ],
            blogs: [
                {
                    id: "lightfallannounce",
                    title: "Introducing Our Biggest Film Yet: Lightfall",
                    date: "5/18/2026",
                    image: "assets/Screenshot 2026-05-18 201135.png",
                    tags: ["News", "Updates"],
                    content: [
                        "Today, we are proud to announce that our film festival hit Lightfall is now ready for streaming right from the Pogger Productions website!",
                        "Lightfall is not only our longest and most practically shot film yet, but also our most recognized and unique film to date. Featuring 30m of action, story, cinema, and practical effects... Lightfall is our most ambitious film to date.",
                        "So, be sure to head on over to the Films page to start watching, and we hope you enjoy!"
                    ]
                },
                {
                    id: "welcome",
                    title: "Welcome To Pogger Productions",
                    date: "2/09/2026",
                    image: "assets/Screenshot 2026-02-09 200611.png",
                    tags: ["News", "Updates"],
                    content: [
                        "This is the new Pogger Productions website. Designed to be a sleek, central hub for all of our content, combined with a cinematic web experience so you can enjoy our films the way they were meant to be watched.",
                        "Feel free to have a look around! On our home page, you will find whatever our latest update or release is. Head on over to the films page to browse our content. And on the about page, you can learn more about our studio.",
                        "This is just the start for Pogger Productions. Keep an eye out for updates and content on our upcoming feature film, Lightfall. Enjoy!"
                    ]
                }
            ]
        };
        // --- CONFIGURATION END ---

        // --- STYLES ---
        const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');

            :root {
                --primary: #f0f0f0;
                --secondary: #888888;
                --accent: #FF3366; 
                --gold: #FFD700;
                --bg-dark: #050505;
                --card-bg: #111111;
            }

            body {
                background-color: var(--bg-dark);
                color: var(--primary);
                font-family: 'Manrope', sans-serif;
                overflow-x: hidden;
                scroll-behavior: smooth;
            }

            h1, h2, h3, .font-display {
                font-family: 'Syne', sans-serif;
            }
            
            .font-mono {
                font-family: 'JetBrains Mono', monospace;
            }

            /* Cinematic Animations */
            @keyframes slowZoom {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes goldPulse {
                0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.1); border-color: rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); border-color: rgba(255, 215, 0, 0.8); }
                100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.1); border-color: rgba(255, 215, 0, 0.3); }
            }

            .animate-fade-in {
                animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
            
            .animate-gold-pulse {
                animation: goldPulse 4s infinite;
            }

            .slow-zoom {
                animation: slowZoom 20s infinite alternate ease-in-out;
            }

            /* Utilities */
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            ::-webkit-scrollbar {
                width: 6px;
            }
            ::-webkit-scrollbar-track {
                background: #000;
            }
            ::-webkit-scrollbar-thumb {
                background: #333;
                border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--accent);
            }

            /* Theater Curtain */
            .theater-curtain {
                transition: opacity 1.5s ease-in-out;
                pointer-events: none;
            }
            .theater-curtain.active {
                pointer-events: all;
                opacity: 1;
            }
            .theater-curtain.inactive {
                opacity: 0;
            }
        `;

        // --- GLOBAL THEATER OVERLAY ---
        // This sits on top of everything to handle the fade-to-black
        const TheaterOverlay = ({ isActive, videoId, onClose }) => {
            const [showVideo, setShowVideo] = useState(false);

            useEffect(() => {
                let timer;
                if (isActive) {
                    // Wait 1.5s after curtain falls to show video
                    timer = setTimeout(() => setShowVideo(true), 1500);
                } else {
                    setShowVideo(false);
                }
                return () => clearTimeout(timer);
            }, [isActive]);

            return (
                <div className={`fixed inset-0 z-[100] bg-black theater-curtain ${isActive ? 'active' : 'inactive'} flex items-center justify-center`}>
                    
                    {/* Return Button - Fades in late */}
                    <div className={`absolute top-8 right-8 z-[110] transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
                        <button 
                            onClick={onClose}
                            className="text-white/30 hover:text-white transition-colors group flex items-center gap-2"
                        >
                            <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-mono">Return to Lobby</span>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Video Player - Fades in */}
                    <div className={`w-full h-full md:w-[90%] md:h-[85%] relative transition-opacity duration-[2000ms] ease-in-out ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
                        {isActive && videoId && (
                             <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white&controls=1`}
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            );
        };

        const Navigation = ({ currentView, setView, siteConfig }) => {
            const [isOpen, setIsOpen] = useState(false);
            const navItems = [
                { id: 'home', label: 'Home' },
                { id: 'films', label: 'Films' },
                { id: 'blog', label: 'Slate' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' }
            ];

            return (
                <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
                    <div 
                        className="font-display font-bold text-2xl tracking-tighter cursor-pointer hover:text-[var(--accent)] transition-colors duration-300 z-50"
                        onClick={() => setView('home')}
                    >
                        {siteConfig.name.toUpperCase()}
                    </div>

                    <div className="hidden md:flex gap-8 items-center z-50">
                        {navItems.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`text-sm tracking-widest uppercase transition-all duration-300 hover:text-[var(--accent)] ${currentView === item.id ? 'text-[var(--accent)] font-bold' : 'text-white'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X color="white" /> : <Menu color="white" />}
                    </button>

                    {isOpen && (
                        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 animate-fade-in">
                            {navItems.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => { setView(item.id); setIsOpen(false); }}
                                    className="font-display text-4xl text-white hover:text-[var(--accent)]"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </nav>
            );
        };

        // --- FILM MODAL ---
        const FilmModal = ({ film, onClose, onPlay }) => {
            if (!film) return null;

            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-1000" 
                        onClick={onClose}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] bg-[#0a0a0a] shadow-2xl overflow-hidden animate-fade-in flex flex-col md:flex-row md:rounded-lg border border-white/5">
                        
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 z-20 text-white hover:text-[var(--accent)] bg-black/50 p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Poster */}
                        <div className="w-full md:w-1/2 h-[30vh] md:h-full relative bg-black overflow-hidden">
                            <img src={film.image} className="w-full h-full object-cover opacity-80" alt="Film cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                        </div>

                        {/* Right Side: Data */}
                        <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto h-full bg-[#0a0a0a] border-l border-white/5 custom-scrollbar">
                            
                            {/* Header */}
                            <div className="flex flex-wrap gap-3 mb-6 items-center">
                                <span className="px-2 py-0.5 border border-gray-700 text-[10px] uppercase tracking-widest text-gray-400 rounded-sm font-mono">{film.rating}</span>
                                <span className="px-2 py-0.5 border border-gray-700 text-[10px] uppercase tracking-widest text-gray-400 rounded-sm font-mono flex items-center gap-1">
                                    <Clock size={10} /> {film.runtime}
                                </span>
                                <span className="px-2 py-0.5 border border-[var(--accent)] text-[var(--accent)] text-[10px] uppercase tracking-widest rounded-sm font-bold flex items-center gap-1">
                                    <Calendar size={10} /> {film.releaseDate}
                                </span>
                            </div>

                            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2 leading-none tracking-tight">{film.title}</h1>
                            <p className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest mb-8">{film.tagline}</p>

                            {/* Buttons */}
                            <div className="flex gap-3 mb-10">
                                <button 
                                    onClick={() => onPlay(film.youtubeId)}
                                    className="bg-[var(--accent)] text-white py-3 px-6 font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,51,102,0.4)]"
                                >
                                    <Play size={14} fill="currentColor" /> Play Film
                                </button>
                                {film.extraFeature && (
                                    <button 
                                        onClick={() => onPlay(film.extraFeature.id)}
                                        className="border border-white/20 text-gray-300 py-3 px-6 font-bold uppercase tracking-widest text-xs rounded-full hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        {film.extraFeature.label}
                                    </button>
                                )}
                            </div>

                            <div className="w-full h-px bg-white/10 mb-10"></div>

                            {/* Synopsis */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Synopsis</h3>
                                <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base">{film.description}</p>
                            </div>

                            {/* Director's Note - Standard Accent (Not Gold) */}
                            {film.directorNote && (
                                <div className="mb-10 p-5 rounded-lg border border-white/10 bg-white/5">
                                    <h3 className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-2">Director's Note</h3>
                                    <p className="text-gray-300 text-sm italic font-serif leading-relaxed">"{film.directorNote}"</p>
                                </div>
                            )}

                            {/* Acclaim (Gold) */}
                            {film.awards && film.awards.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Award size={14} /> Acclaim
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {film.awards.map((award, i) => (
                                            <div key={i} className="px-4 py-2 border border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10 rounded-sm font-display font-bold text-xs uppercase tracking-wider animate-gold-pulse">
                                                {award}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Credits */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Key Credits</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    {film.keyCredits?.map((c, i) => (
                                        <div key={i}>
                                            <div className="text-[10px] text-[var(--accent)] uppercase tracking-wider mb-0.5">{c.role}</div>
                                            <div className="text-white text-sm font-bold">{c.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Specs (Including Location) */}
                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Technical Specifications</h3>
                                <div className="space-y-3">
                                    {film.techSpecs && Object.entries(film.techSpecs).filter(([_, v]) => v && v.trim() !== '').map(([k, v], i) => (
                                        <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2">
                                            <span className="text-gray-500 capitalize flex items-center gap-2">
                                                {k === 'camera' && <CameraIcon size={12} />}
                                                {k === 'lens' && <Aperture size={12} />}
                                                {k === 'audio' && <Mic size={12} />}
                                                {k === 'aspectRatio' && <Monitor size={12} />}
                                                {k === 'software' && <Laptop size={12} />}
                                                {k === 'productionTime' && <Hourglass size={12} />}
                                                {k === 'location' && <MapPin size={12} />}
                                                {k.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className="text-gray-300 font-mono text-xs">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const publicFilms = films.filter(f => !f.archived);
            const filmFeature = publicFilms.find(f => f.contentId === siteConfig.featured || f.id === siteConfig.featured);
            const blogFeature = blogs.find(b => b.contentId === siteConfig.featured || b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || publicFilms[0] || blogs[0];
            const isFilm = activeFeature === filmFeature || (!filmFeature && !blogFeature && activeFeature === publicFilms[0]);

            if (!activeFeature) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                        <h1 className="text-white">No content available</h1>
                    </div>
                );
            }

            return (
                <div className="min-h-screen">
                    <div className="relative w-full h-screen overflow-hidden">
                        <img 
                            src={activeFeature.image || ''} 
                            alt="Hero" 
                            className="w-full h-full object-cover slow-zoom bg-gray-900"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 flex flex-col items-start justify-end h-full pointer-events-none">
                            <div className="pointer-events-auto max-w-4xl animate-fade-in">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 border border-[var(--accent)] text-[var(--accent)] text-xs font-bold tracking-[0.2em] uppercase bg-black/50 backdrop-blur-md">
                                        Featured
                                    </span>
                                </div>
                                
                                <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-2 leading-none">
                                    {activeFeature.title}
                                </h1>
                                <p className="font-mono text-[var(--accent)] uppercase tracking-widest text-sm mb-6">
                                    {siteConfig.tagline}
                                </p>
                                
                                <div className="flex gap-6">
                                    <button 
                                        onClick={() => isFilm ? openFilm(activeFeature) : openBlog(activeFeature)}
                                        className="bg-[var(--accent)] text-white px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
                                    >
                                        {isFilm ? 'Enter Theater' : 'Read Article'} <Play size={16} fill="currentColor" />
                                    </button>
                                    <button 
                                        onClick={() => setView(isFilm ? 'films' : 'blog')}
                                        className="border border-white/30 text-white px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        View All Productions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const FilmsView = ({ openModal, films }) => {
            const publicFilms = films.filter(f => !f.archived);
            const [viewMode, setViewMode] = useState('massive'); // 'massive' or 'grid'
            const [filterOpen, setFilterOpen] = useState(false);
            const [activeFilter, setActiveFilter] = useState('All');
            const [searchTerm, setSearchTerm] = useState('');

            const allTags = ['All', ...new Set(publicFilms.flatMap(f => f.tags || []))];
            
            const filteredFilms = publicFilms.filter(f => {
                const matchesTag = activeFilter === 'All' || (f.tags && f.tags.includes(activeFilter));
                const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesTag && matchesSearch;
            });

            return (
                <div className="min-h-screen pt-24 pb-20 animate-fade-in flex flex-col">
                    <div className="px-6 md:px-12 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="font-display text-3xl font-bold text-white mb-2">Productions</h1>
                            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Select a film to view details</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="SEARCH..." 
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-b border-gray-700 text-white py-2 pl-8 pr-4 focus:outline-none focus:border-[var(--accent)] w-32 focus:w-48 transition-all duration-300 placeholder-gray-600 font-display uppercase text-sm tracking-wider"
                                />
                                <Search className="absolute left-0 top-2 text-gray-500" size={16} />
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-[var(--accent)] transition-colors"
                                >
                                    Filter <Filter size={16} />
                                </button>
                                {filterOpen && (
                                    <div className="absolute right-0 top-10 bg-[#111] border border-gray-800 p-4 w-48 rounded-lg shadow-xl z-30">
                                        {allTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => { setActiveFilter(tag); setFilterOpen(false); }}
                                                className={`block w-full text-left py-2 px-2 text-sm uppercase tracking-wider hover:bg-white/5 ${activeFilter === tag ? 'text-[var(--accent)]' : 'text-gray-400'}`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Switcher */}
                            <div className="flex bg-[#111] p-1 rounded-lg border border-gray-800">
                                <button 
                                    onClick={() => setViewMode('massive')} 
                                    className={`p-2 rounded ${viewMode === 'massive' ? 'bg-[var(--accent)] text-white' : 'text-gray-500'}`}
                                >
                                    <Layers size={20} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('grid')} 
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'text-gray-500'}`}
                                >
                                    <Grid size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'massive' ? (
                        // MASSIVE MODE (Stacked 16:9 with Overlay)
                        <div className="px-6 md:px-12 flex flex-col gap-12">
                            {filteredFilms.map(film => (
                                <div 
                                    key={film.id}
                                    onClick={() => openModal(film)}
                                    className="relative w-full aspect-video md:aspect-[21/9] group cursor-pointer overflow-hidden rounded-sm"
                                >
                                    <img 
                                        src={film.image} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        alt={film.title} 
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2 py-1 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest">{film.category}</span>
                                            <span className="text-gray-300 font-mono text-xs">{film.runtime}</span>
                                        </div>
                                        <h2 className="font-display text-4xl md:text-7xl font-bold text-white mb-2">{film.title}</h2>
                                        <p className="text-gray-300 font-mono uppercase tracking-widest text-xs md:text-sm">{film.tagline}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // GRID MODE
                        <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {filteredFilms.map(film => (
                                <div 
                                    key={film.id} 
                                    onClick={() => openModal(film)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-video overflow-hidden rounded-sm mb-4">
                                        <img 
                                            src={film.image} 
                                            alt={film.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">{film.title}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-500 text-xs font-mono">{film.releaseDate}</span>
                                        <span className="text-[var(--accent)] text-xs font-bold uppercase">{film.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        };

        const BlogView = ({ openModal, blogs }) => {
            return (
                <div className="min-h-screen pt-32 px-6 pb-20 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-16 border-b border-gray-800 pb-8">News & Updates</h1>
                    <div className="space-y-16">
                        {blogs.map((blog, idx) => (
                            <div key={blog.id || idx} className="group cursor-pointer grid md:grid-cols-2 gap-8 items-center" onClick={() => openModal(blog)}>
                                <div className="aspect-[4/3] overflow-hidden rounded-sm">
                                    <img 
                                        src={blog.image} 
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-4">
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.tags[0]}</span>
                                    </div>
                                    <h2 className="font-display text-3xl font-bold text-white mb-4 group-hover:underline decoration-[var(--accent)] underline-offset-4">{blog.title}</h2>
                                    <div className="text-gray-400 line-clamp-3 mb-6 prose prose-invert" dangerouslySetInnerHTML={{ __html: marked.parse(Array.isArray(blog.content) ? blog.content[0] : blog.content) }}></div>
                                    <span className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        Read Article <ChevronRight size={14} className="text-[var(--accent)]" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const AboutView = ({ siteConfig }) => {
            const scrollRef = useRef(null);

            const scroll = (offset) => {
                if (scrollRef.current) {
                    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
                }
            };

            return (
                <div className="min-h-screen pt-32 pb-20 animate-fade-in">
                    {/* Header */}
                    <div className="px-6 max-w-7xl mx-auto mb-20 text-center">
                        <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-6">What We Do</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">{siteConfig.description}</p>
                    </div>

                    {/* Generic Content Sections */}
                    <div className="max-w-5xl mx-auto px-6 mb-24 grid md:grid-cols-2 gap-16">
                        {(siteConfig.aboutParagraphs || [
                            { title: 'Company History', content: siteConfig.aboutHistory || '' },
                            { title: 'Pogger?', content: siteConfig.aboutVision || '' }
                        ]).map((para, i) => (
                            <div key={i}>
                                <h2 className="font-display text-3xl font-bold text-white mb-6">{para.title}</h2>
                                <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                                    {para.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Integrated Awards Grid */}
                    <div className="max-w-7xl mx-auto px-6 mb-24">
                        <h2 className="font-display text-3xl font-bold text-[var(--gold)] mb-8 text-center flex items-center justify-center gap-3">
                             <Award /> Award Recognition <Award />
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {siteConfig.aboutAwards.map((award, i) => (
                                <div key={i} className="bg-[#111] border border-[var(--gold)]/30 p-6 flex items-center justify-center text-center group hover:border-[var(--gold)] transition-colors rounded-sm">
                                    <span className="text-[var(--gold)] font-display font-bold uppercase tracking-wider text-xs">{award}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery with Buttons */}
                    <div className="mb-32">
                        <div className="px-6 mb-8 flex justify-between items-end max-w-7xl mx-auto">
                            <h2 className="font-display text-3xl font-bold text-white">Behind The Scenes</h2>
                            <div className="flex gap-4">
                                <button onClick={() => scroll(-400)} className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={() => scroll(400)} className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                        <div 
                            ref={scrollRef}
                            className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-8 snap-x"
                        >
                            {siteConfig.aboutGallery.map((img, i) => (
                                <div key={i} className="snap-center flex-none w-[300px] md:w-[500px] aspect-[16/9] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src={img} className="w-full h-full object-cover" alt="BTS" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        const BlogModal = ({ post, onClose }) => {
            if (!post) return null;

            return (
                <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto animate-fade-in custom-scrollbar">
                     <button 
                        onClick={onClose}
                        className="fixed top-6 right-6 z-50 text-white hover:text-[var(--accent)] bg-black/50 p-2 rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={24} />
                    </button>
                    {/* Blog Content same as V4 */}
                    <div className="w-full h-[60vh] relative">
                        <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-20 max-w-4xl">
                            <h1 className="font-display text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto px-6 py-12">
                         <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light font-serif prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent)]" dangerouslySetInnerHTML={{ __html: marked.parse(Array.isArray(post.content) ? post.content.join('\n\n') : post.content) }}></div>
                    </div>
                </div>
            );
        };

        const CameraIcon = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;

        const compressImage = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_WIDTH = 1280;
                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/webp', 0.8));
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        };
        
        const ConfirmDeleteButton = ({ onConfirm }) => {
            const [confirming, setConfirming] = useState(false);
            return (
                <button 
                    type="button"
                    onClick={() => {
                        if (confirming) {
                            onConfirm();
                        } else {
                            setConfirming(true);
                            setTimeout(() => setConfirming(false), 3000);
                        }
                    }}
                    className={`p-2 rounded transition-colors ${confirming ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-500'}`}
                >
                    {confirming ? <Check size={16} /> : <Trash2 size={16} />}
                </button>
            );
        };

        
        const ContactView = ({ siteConfig }) => {
            const [form, setForm] = useState({ name: '', email: '', message: '' });
            const [status, setStatus] = useState('');
            const submitContact = async (e) => {
                e.preventDefault();
                setStatus('sending');
                try {
                    await addDoc(collection(db, 'messages'), { ...form, createdAt: Date.now() });
                    setStatus('sent');
                    setForm({ name: '', email: '', message: '' });
                    setTimeout(() => setStatus(''), 5000);
                } catch(err) {
                    setStatus('error');
                }
            };
            return (
                <div className="min-h-screen pt-32 pb-20 animate-fade-in flex flex-col md:flex-row max-w-7xl mx-auto px-6 gap-16">
                    <div className="flex-1">
                        <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-6">Get In Touch</h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">Whether you have a project in mind, want to collaborate, or just want to say hi, we'd love to hear from you.</p>
                        
                        {siteConfig.contactEmail && (
                            <div className="mb-12">
                                <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Email</h3>
                                <a href={`mailto:${siteConfig.contactEmail}`} className="text-2xl text-[var(--accent)] hover:text-white transition-colors">{siteConfig.contactEmail}</a>
                            </div>
                        )}
                        {siteConfig.contactPhone && (
                            <div className="mb-12">
                                <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</h3>
                                <p className="text-2xl text-white">{siteConfig.contactPhone}</p>
                            </div>
                        )}
                        
                        <form onSubmit={submitContact} className="space-y-6">
                            <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors" />
                            <input type="email" placeholder="Your Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors" />
                            <textarea placeholder="Your Message" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors min-h-[200px]"></textarea>
                            <button type="submit" disabled={status === 'sending'} className="bg-[var(--accent)] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm rounded hover:bg-white hover:text-black transition-colors w-full md:w-auto">
                                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                            </button>
                            {status === 'error' && <p className="text-red-500 mt-2">Failed to send message. Please try again.</p>}
                        </form>
                    </div>
                    {siteConfig.contactImage && (
                        <div className="flex-1 hidden md:block">
                            <img src={siteConfig.contactImage} alt="Contact" className="w-full h-full object-cover rounded grayscale hover:grayscale-0 transition-all duration-1000" />
                        </div>
                    )}
                </div>
            );
        };

        
        const ContactMessagesView = () => {
            const [messages, setMessages] = useState([]);
            useEffect(() => {
                const q = collection(db, 'messages');
                const unsub = onSnapshot(q, (snap) => {
                    setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.createdAt - a.createdAt));
                });
                return () => unsub();
            }, []);
            return (
                <div className="space-y-4">
                    {messages.length === 0 ? <p className="text-gray-400">No messages yet.</p> : messages.map(m => (
                        <div key={m.id} className="bg-[#0a0a0a] p-6 border border-gray-800 rounded">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-white font-bold text-lg">{m.name}</h4>
                                    <a href={`mailto:${m.email}`} className="text-[var(--accent)] text-sm">{m.email}</a>
                                </div>
                                <span className="text-gray-500 text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{m.message}</p>
                        </div>
                    ))}
                </div>
            );
        };

        const AdminView = ({ films, blogs, siteConfig }) => {
            const [user, setUser] = useState(null);

            // Drag and drop state
            const [draggedFilmIdx, setDraggedFilmIdx] = useState(null);
            const [draggedBlogIdx, setDraggedBlogIdx] = useState(null);

            const [draggedGalleryIdx, setDraggedGalleryIdx] = useState(null);
            
            const handleGalleryImageUpload = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setLoading(true);
                try {
                    const compressed = await compressImage(file);
                    setLocalConfig(prev => ({
                        ...prev,
                        aboutGallery: [...(prev.aboutGallery || []), compressed]
                    }));
                } catch(err) { alert(err.message); }
                setLoading(false);
            };

            const removeGalleryImage = (idx) => {
                setLocalConfig(prev => {
                    const newGallery = [...prev.aboutGallery];
                    newGallery.splice(idx, 1);
                    return { ...prev, aboutGallery: newGallery };
                });
            };

            const handleGalleryDrop = (e, idx) => {
                e.preventDefault();
                if (draggedGalleryIdx === null || draggedGalleryIdx === idx) return;
                setLocalConfig(prev => {
                    const newGallery = [...prev.aboutGallery];
                    const item = newGallery.splice(draggedGalleryIdx, 1)[0];
                    newGallery.splice(idx, 0, item);
                    return { ...prev, aboutGallery: newGallery };
                });
                setDraggedGalleryIdx(null);
            };


            const handleFilmDrop = async (e, idx) => {
                e.preventDefault();
                if (draggedFilmIdx === null || draggedFilmIdx === idx) return;
                const newFilms = [...films];
                const item = newFilms.splice(draggedFilmIdx, 1)[0];
                newFilms.splice(idx, 0, item);
                setDraggedFilmIdx(null);
                setLoading(true);
                try {
                    await Promise.all(newFilms.map((f, i) => updateDoc(doc(db, 'films', f.id), { order: i })));
                } catch(err) { console.error(err); }
                setLoading(false);
            };

            const handleBlogDrop = async (e, idx) => {
                e.preventDefault();
                if (draggedBlogIdx === null || draggedBlogIdx === idx) return;
                const newBlogs = [...blogs];
                const item = newBlogs.splice(draggedBlogIdx, 1)[0];
                newBlogs.splice(idx, 0, item);
                setDraggedBlogIdx(null);
                setLoading(true);
                try {
                    await Promise.all(newBlogs.map((b, i) => updateDoc(doc(db, 'blogs', b.id), { order: i })));
                } catch(err) { console.error(err); }
                setLoading(false);
            };

            const [activeTab, setActiveTab] = useState('settings');
            const [loading, setLoading] = useState(false);
            
            // Site Settings
            const [localConfig, setLocalConfig] = useState(siteConfig);

            // Sync if prop updates
            useEffect(() => { setLocalConfig(siteConfig); }, [siteConfig]);

            // Forms
            const [editingId, setEditingId] = useState(null);
            const [filmForm, setFilmForm] = useState({ contentId: '',
                title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '',
                youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '',
                audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: ''
            });
            const [blogForm, setBlogForm] = useState({ contentId: '',
                title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: ''
            });

            useEffect(() => {
                const unsub = onAuthStateChanged(auth, (u) => setUser(u));
                return () => unsub();
            }, []);

            const handleLogin = async (e) => {
                e.preventDefault();
                try {
                    const result = await signInWithPopup(auth, googleProvider);
                    if (result.user.email !== 'owen.klea@gmail.com') {
                        await signOut(auth);
                        alert('Unauthorized email. Access denied.');
                    }
                } catch (err) {
                    alert('Login failed: ' + err.message);
                }
            };

            const handleLogout = () => signOut(auth);

            const handleImageUpload = async (e, setForm, formData) => {
                const file = e.target.files[0];
                if (file) {
                    const compressed = await compressImage(file);
                    setForm({ ...formData, image: compressed });
                }
            };

            const saveSiteConfig = async () => {
                setLoading(true);
                try {
                    // Update the array fields by splitting newlines for gallery and awards
                    const dataToSave = { ...localConfig };
                    if (typeof dataToSave.aboutAwards === 'string') dataToSave.aboutAwards = dataToSave.aboutAwards.split('\n').filter(Boolean);
                    if (typeof dataToSave.allowedArchiveEmails === 'string') dataToSave.allowedArchiveEmails = dataToSave.allowedArchiveEmails.split('\n').filter(Boolean);
                    

                    await setDoc(doc(db, 'config', 'main'), dataToSave);
                    alert('Settings saved!');
                } catch (e) { alert('Error: ' + e.message); }
                setLoading(false);
            };

            const saveFilm = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const data = {
                        contentId: filmForm.contentId,
                        title: filmForm.title, tagline: filmForm.tagline, category: filmForm.category,
                        tags: filmForm.tags.split(',').map(t=>t.trim()).filter(Boolean),
                        releaseDate: filmForm.releaseDate, rating: filmForm.rating, runtime: filmForm.runtime,
                        youtubeId: filmForm.youtubeId, description: filmForm.description, directorNote: filmForm.directorNote,
                        image: filmForm.image,
                        extraFeature: filmForm.extraFeatureId ? { id: filmForm.extraFeatureId, label: filmForm.extraFeatureLabel } : null,
                        techSpecs: {
                            location: filmForm.location, camera: filmForm.camera, lens: filmForm.lens, aspectRatio: filmForm.aspectRatio,
                            audio: filmForm.audio, software: filmForm.software, productionTime: filmForm.productionTime
                        },
                        awards: filmForm.awards.split('\n').filter(Boolean),
                        archived: !!filmForm.archived,
                        keyCredits: filmForm.credits.split('\n').map(c => {
                            const parts = c.split(':');
                            return { role: parts[0]?.trim(), name: parts.slice(1).join(':')?.trim() };
                        }).filter(c => c.role && c.name),
                        createdAt: editingId ? (filmForm.createdAt || Date.now()) : Date.now()
                    };
                    if (editingId) {
                        await updateDoc(doc(db, 'films', editingId), data);
                    } else {
                        await addDoc(collection(db, 'films'), data);
                    }
                    alert('Film saved!');
                    setEditingId(null);
                    setFilmForm({ contentId: '', title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '', archived: false });
                } catch (e) { alert('Error: ' + e.message); }
                setLoading(false);
            };

            const saveBlog = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const data = {
                        contentId: blogForm.contentId,
                        title: blogForm.title, date: blogForm.date, category: blogForm.category,
                        tags: blogForm.tags.split(',').map(t=>t.trim()).filter(Boolean),
                        content: blogForm.content, image: blogForm.image,
                        createdAt: editingId ? (blogForm.createdAt || Date.now()) : Date.now()
                    };
                    if (editingId) {
                        await updateDoc(doc(db, 'blogs', editingId), data);
                    } else {
                        await addDoc(collection(db, 'blogs'), data);
                    }
                    alert('Blog saved!');
                    setEditingId(null);
                    setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' });
                } catch (e) { alert('Error: ' + e.message); }
                setLoading(false);
            };

            const editFilm = (f) => {
                setEditingId(f.id);
                setFilmForm({
                    contentId: f.contentId||'', title: f.title||'', tagline: f.tagline||'', category: f.category||'', tags: (f.tags||[]).join(', '),
                    releaseDate: f.releaseDate||'', rating: f.rating||'', runtime: f.runtime||'', youtubeId: f.youtubeId||'',
                    description: f.description||'', directorNote: f.directorNote||'', location: f.techSpecs?.location||'',
                    camera: f.techSpecs?.camera||'', lens: f.techSpecs?.lens||'', aspectRatio: f.techSpecs?.aspectRatio||'',
                    audio: f.techSpecs?.audio||'', software: f.techSpecs?.software||'', productionTime: f.techSpecs?.productionTime||'',
                    awards: (f.awards||[]).join('\n'), credits: (f.keyCredits||[]).map(c=>`${c.role}:${c.name}`).join('\n'),
                    image: f.image||'', extraFeatureId: f.extraFeature?.id||'', extraFeatureLabel: f.extraFeature?.label||'',
                    createdAt: f.createdAt,
                    archived: !!f.archived
                });
            };

            const editBlog = (b) => {
                setEditingId(b.id);
                setBlogForm({
                    contentId: b.contentId||'', title: b.title||'', date: b.date||'', category: b.category||'', tags: (b.tags||[]).join(', '),
                    content: typeof b.content === 'string' ? b.content : (b.content||[]).join('\n\n'), image: b.image||'',
                    createdAt: b.createdAt
                });
            };

            const deleteDocPrompt = async (col, id) => {
                if (confirm('Are you sure you want to delete this?')) {
                    await deleteDoc(doc(db, col, id));
                }
            };

            if (!user) {
                return (
                    <div className="min-h-screen pt-32 px-6 flex items-center justify-center animate-fade-in">
                        <div className="bg-[#111] p-8 rounded-lg border border-gray-800 w-full max-w-md text-center">
                            <h2 className="font-display text-3xl text-white mb-6">Admin Login</h2>
                            <p className="text-gray-400 mb-8 text-sm">Please sign in with your authorized Google account to manage Pogger Productions.</p>
                            <button onClick={handleLogin} className="w-full bg-white text-black font-bold p-3 rounded hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen pt-32 px-6 pb-20 max-w-5xl mx-auto animate-fade-in">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                        <h1 className="font-display text-4xl text-white">Dashboard</h1>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-[var(--accent)] transition-colors">
                            Logout <LogOut size={16} />
                        </button>
                    </div>

                    <div className="flex gap-4 mb-8 overflow-x-auto">
                        <button onClick={() => { setActiveTab('settings'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'settings' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Settings</button>
                        <button onClick={() => { setActiveTab('about'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'about' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>About</button>
                        <button onClick={() => { setActiveTab('contact'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'contact' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Contact</button>
                        <button onClick={() => { setActiveTab('films'); setEditingId(null); setFilmForm({ contentId: '', title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '', archived: false }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'films' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Films</button>
                        <button onClick={() => { setActiveTab('blogs'); setEditingId(null); setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'blogs' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Blogs</button>
                    </div>

                                        {activeTab === 'settings' && (
                        <div className="space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800 animate-fade-in">
                            <h2 className="font-display text-2xl text-white mb-6">Site Configuration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Global Banner Text (Leave empty to hide)</label>
                                    <input type="text" placeholder="e.g. New Film Out Now!" value={localConfig.bannerText||''} onChange={e => setLocalConfig({...localConfig, bannerText: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Banner Target Content ID (Optional)</label>
                                    <input type="text" placeholder="e.g. lightfall" value={localConfig.bannerTargetId||''} onChange={e => setLocalConfig({...localConfig, bannerTargetId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Site Description</label>
                                    <textarea value={localConfig.description} onChange={e => setLocalConfig({...localConfig, description: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[100px]"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Featured Tagline (Homepage)</label>
                                    <input type="text" value={localConfig.tagline} onChange={e => setLocalConfig({...localConfig, tagline: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Featured Content ID (Film or Blog ID)</label>
                                    <input type="text" value={localConfig.featured} onChange={e => setLocalConfig({...localConfig, featured: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div className="col-span-2 border-t border-gray-800 pt-6 mt-2">
                                    <h4 className="text-sm text-[var(--accent)] font-bold mb-4 uppercase tracking-widest">Archive Access Configuration</h4>
                                    <label className="block text-sm text-gray-400 mb-2">Allowed Archive Emails (One per line)</label>
                                    <textarea placeholder="e.g. family@gmail.com\nfriend@yahoo.com" value={Array.isArray(localConfig.allowedArchiveEmails) ? localConfig.allowedArchiveEmails.join('\n') : (localConfig.allowedArchiveEmails||'')} onChange={e => setLocalConfig({...localConfig, allowedArchiveEmails: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[100px]"></textarea>
                                    <p className="text-xs text-gray-500 mt-2">These users can sign in with Google to view archived films.</p>
                                </div>
                            </div>
                            <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}
                    {activeTab === 'about' && (
                        <div className="space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800 animate-fade-in">
                            <h2 className="font-display text-2xl text-white mb-6">About Page</h2>
                            
                            <div className="space-y-4 mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Content Paragraphs</h3>
                                {(localConfig.aboutParagraphs || []).map((para, idx) => (
                                    <div key={idx} className="bg-[#0a0a0a] p-4 border border-gray-800 rounded relative group">
                                        <input type="text" placeholder="Title" value={para.title} onChange={e => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP[idx].title = e.target.value;
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="w-full bg-transparent text-white font-bold mb-2 outline-none border-b border-gray-800 focus:border-[var(--accent)]" />
                                        <textarea placeholder="Content" value={para.content} onChange={e => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP[idx].content = e.target.value;
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="w-full bg-transparent text-gray-400 outline-none min-h-[100px]"></textarea>
                                        <button onClick={() => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP.splice(idx, 1);
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                                <button onClick={() => setLocalConfig({...localConfig, aboutParagraphs: [...(localConfig.aboutParagraphs||[]), {title: '', content: ''}]})} className="text-sm text-[var(--accent)] font-bold hover:text-white flex items-center gap-1"><Plus size={16}/> Add Paragraph</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Awards (One per line)</label>
                                    <textarea value={Array.isArray(localConfig.aboutAwards) ? localConfig.aboutAwards.join('\n') : localConfig.aboutAwards} onChange={e => setLocalConfig({...localConfig, aboutAwards: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-4 uppercase tracking-widest">Gallery Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {(localConfig.aboutGallery || []).map((img, idx) => (
                                            <div key={idx} draggable onDragStart={(e) => { setDraggedGalleryIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleGalleryDrop(e, idx)} className={`relative aspect-[16/9] group rounded overflow-hidden cursor-move border border-gray-700 transition-opacity ${draggedGalleryIdx === idx ? 'opacity-50' : 'opacity-100'}`}>
                                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 aspect-[16/9] rounded cursor-pointer transition-colors w-full">
                                            <Upload size={20} />
                                            <span className="font-mono text-xs uppercase text-center px-2">Upload</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Drag and drop images to re-arrange them.</p>
                                </div>
                            </div>
                            <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}
                    {activeTab === 'contact' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-[#111] p-8 rounded-lg border border-gray-800">
                                <h2 className="font-display text-2xl text-white mb-6">Contact Page Config</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                                        <input type="email" placeholder="e.g. contact@pogger.com" value={localConfig.contactEmail||''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Contact Phone</label>
                                        <input type="text" placeholder="e.g. +1 234 567 8900" value={localConfig.contactPhone||''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Contact Page Image</label>
                                        <div className="flex gap-4 items-center">
                                            {localConfig.contactImage && <img src={localConfig.contactImage} className="w-24 h-24 object-cover rounded border border-gray-700" alt="Contact" />}
                                            <label className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 px-4 py-2 rounded cursor-pointer transition-colors">
                                                <Upload size={16} /> <span className="font-mono text-sm uppercase">Upload Image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    if(e.target.files[0]) {
                                                        const img = await compressImage(e.target.files[0]);
                                                        setLocalConfig({...localConfig, contactImage: img});
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                    {loading ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                            
                            <div className="bg-[#111] p-8 rounded-lg border border-gray-800">
                                <h2 className="font-display text-2xl text-white mb-6">Contact Messages</h2>
                                <ContactMessagesView />
                            </div>
                        </div>
                    )}

                    {activeTab === 'films' && (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Existing Films</h3>
                                {films.map((f, idx) => (
                                    <div key={f.id} draggable onDragStart={(e) => { setDraggedFilmIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleFilmDrop(e, idx)} className={`bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center cursor-move transition-opacity ${draggedFilmIdx === idx ? "opacity-50" : "opacity-100"}`}>
                                        <span className="font-bold truncate">{f.title} {f.archived && <span className="text-xs text-[var(--accent)] border border-[var(--accent)] px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Archived</span>}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => editFilm(f)} className="text-gray-400 hover:text-white"><Check size={16} /></button>
                                            <ConfirmDeleteButton onConfirm={() => deleteDoc(doc(db, "films", f.id))} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={saveFilm} className="md:col-span-2 space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-display text-2xl text-white">{editingId ? 'Edit Film' : 'New Film'}</h2>
                                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFilmForm({ contentId: '', title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '', archived: false }); }} className="text-sm text-gray-400 hover:text-white">Cancel Edit</button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Content ID (e.g. featured-1)" value={filmForm.contentId} onChange={e => setFilmForm({...filmForm, contentId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                                                        <div className="col-span-2 flex items-center gap-4 bg-[#0a0a0a] border border-gray-700 p-4 rounded mb-2">
                                        <input type="checkbox" id="archived" checked={filmForm.archived||false} onChange={e => setFilmForm({...filmForm, archived: e.target.checked})} className="w-5 h-5 accent-[var(--accent)] cursor-pointer" />
                                        <div>
                                            <label htmlFor="archived" className="text-white font-bold cursor-pointer">Archive Film</label>
                                            <p className="text-xs text-gray-400">Archived films are only visible to authorized emails via the Archives view.</p>
                                        </div>
                                    </div>
                                    <input type="text" placeholder="Title" value={filmForm.title} onChange={e => setFilmForm({...filmForm, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" required />
                                    <input type="text" placeholder="Tagline" value={filmForm.tagline} onChange={e => setFilmForm({...filmForm, tagline: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Category (e.g. Narrative, Documentary)" value={filmForm.category} onChange={e => setFilmForm({...filmForm, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" required />
                                    <input type="text" placeholder="Tags (comma separated)" value={filmForm.tags} onChange={e => setFilmForm({...filmForm, tags: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Release Date (e.g. 5/15/2026)" value={filmForm.releaseDate} onChange={e => setFilmForm({...filmForm, releaseDate: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Rating (e.g. PG)" value={filmForm.rating} onChange={e => setFilmForm({...filmForm, rating: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Runtime (e.g. 30m 0s)" value={filmForm.runtime} onChange={e => setFilmForm({...filmForm, runtime: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="YouTube Video ID (Main)" value={filmForm.youtubeId} onChange={e => setFilmForm({...filmForm, youtubeId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" required />
                                    <div className="col-span-2 border-t border-gray-800 pt-4 mt-2">
                                        <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Extra Features (Trailer)</h4>
                                    </div>
                                    <input type="text" placeholder="Button Label (e.g. Watch Trailer)" value={filmForm.extraFeatureLabel} onChange={e => setFilmForm({...filmForm, extraFeatureLabel: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Trailer YouTube Video ID" value={filmForm.extraFeatureId} onChange={e => setFilmForm({...filmForm, extraFeatureId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />

                                    <div className="col-span-2 border-t border-gray-800 pt-4 mt-2">
                                        <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Content</h4>
                                    </div>
                                    <textarea placeholder="Synopsis / Description" value={filmForm.description} onChange={e => setFilmForm({...filmForm, description: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded col-span-2 min-h-[100px]"></textarea>
                                    <textarea placeholder="Director's Note" value={filmForm.directorNote} onChange={e => setFilmForm({...filmForm, directorNote: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded col-span-2 min-h-[100px]"></textarea>
                                    <textarea placeholder="Key Credits (One per line, format: Role:Name)" value={filmForm.credits} onChange={e => setFilmForm({...filmForm, credits: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded col-span-2 min-h-[100px]"></textarea>
                                    <textarea placeholder="Awards (One per line)" value={filmForm.awards} onChange={e => setFilmForm({...filmForm, awards: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded col-span-2 min-h-[100px]"></textarea>

                                    <div className="col-span-2 border-t border-gray-800 pt-4 mt-2">
                                        <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Tech Specs</h4>
                                    </div>
                                    <input type="text" placeholder="Location" value={filmForm.location} onChange={e => setFilmForm({...filmForm, location: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Camera" value={filmForm.camera} onChange={e => setFilmForm({...filmForm, camera: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Lens" value={filmForm.lens} onChange={e => setFilmForm({...filmForm, lens: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Aspect Ratio" value={filmForm.aspectRatio} onChange={e => setFilmForm({...filmForm, aspectRatio: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Audio" value={filmForm.audio} onChange={e => setFilmForm({...filmForm, audio: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Software" value={filmForm.software} onChange={e => setFilmForm({...filmForm, software: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Production Time" value={filmForm.productionTime} onChange={e => setFilmForm({...filmForm, productionTime: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />

                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Cover Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 px-6 py-4 rounded cursor-pointer transition-colors w-full">
                                                <Upload size={20} />
                                                <span className="font-mono text-sm">Select Image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setFilmForm, filmForm)} />
                                            </label>
                                            {filmForm.image && (
                                                <div className="h-14 w-20 overflow-hidden rounded">
                                                    <img src={filmForm.image} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button disabled={loading} type="submit" className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                    {loading ? 'Saving...' : ( <><Plus size={16} /> {editingId ? 'Update Film' : 'Publish Film'}</> )}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'blogs' && (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Existing Blogs</h3>
                                {blogs.map((b, idx) => (
                                    <div key={b.id} draggable onDragStart={(e) => { setDraggedBlogIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleBlogDrop(e, idx)} className={`bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center cursor-move transition-opacity ${draggedBlogIdx === idx ? "opacity-50" : "opacity-100"}`}>
                                        <span className="font-bold truncate">{b.title}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => editBlog(b)} className="text-gray-400 hover:text-white"><Check size={16} /></button>
                                            <ConfirmDeleteButton onConfirm={() => deleteDoc(doc(db, "blogs", b.id))} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={saveBlog} className="md:col-span-2 space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-display text-2xl text-white">{editingId ? 'Edit Blog' : 'New Blog'}</h2>
                                    {editingId && <button type="button" onClick={() => { setEditingId(null); setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className="text-sm text-gray-400 hover:text-white">Cancel Edit</button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Content ID (e.g. blog-feat-1)" value={blogForm.contentId} onChange={e => setBlogForm({...blogForm, contentId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" required />
                                    <input type="text" placeholder="Date (e.g. MM/DD/YYYY)" value={blogForm.date} onChange={e => setBlogForm({...blogForm, date: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" required />
                                    <input type="text" placeholder="Category" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <input type="text" placeholder="Tags (comma separated)" value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    <textarea placeholder="Content (Markdown Supported!)" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded col-span-2 min-h-[300px]" required></textarea>
                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Cover Image</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 px-6 py-4 rounded cursor-pointer transition-colors w-full">
                                                <Upload size={20} />
                                                <span className="font-mono text-sm">Select Image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setBlogForm, blogForm)} />
                                            </label>
                                            {blogForm.image && (
                                                <div className="h-14 w-20 overflow-hidden rounded">
                                                    <img src={blogForm.image} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button disabled={loading} type="submit" className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                    {loading ? 'Saving...' : ( <><Plus size={16} /> {editingId ? 'Update Post' : 'Publish Post'}</> )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            );
        };

        // --- MAIN APP ---
        
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

            const allowedEmails = Array.isArray(siteConfig.allowedArchiveEmails) ? siteConfig.allowedArchiveEmails : (siteConfig.allowedArchiveEmails||'').split('\n').map(e=>e.trim()).filter(Boolean);
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

        export default function App() {
            const [currentView, setView] = useState('home');
            const [bannerDismissed, setBannerDismissed] = useState(false);
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
                name: CONFIG.brand.name,
                bannerText: '',
                bannerTargetId: ''
            });

            // Theater State
            const [theaterActive, setTheaterActive] = useState(false);
            const [currentVideoId, setCurrentVideoId] = useState(null);

            useEffect(() => {
                const unsubFilms = onSnapshot(collection(db, 'films'), (snapshot) => {
                    const fbFilms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
                    // Filter out hardcoded CONFIG films if they are already in firestore by ID? Or just use fbFilms if not empty.
                    // Let's just use fbFilms. If they want to wipe the slate clean, we shouldn't show CONFIG.films.
                    setFilms(fbFilms.length > 0 ? fbFilms : CONFIG.films);
                });
                const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
                    const fbBlogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
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
                    
                    {!bannerDismissed && siteConfig.bannerText && (
                        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-[var(--accent)] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-4 text-sm font-bold uppercase tracking-widest animate-fade-in border border-white/20">
                            <span>{siteConfig.bannerText}</span>
                            {siteConfig.bannerTargetId && (
                                <button 
                                    onClick={() => {
                                        const publicFilms = films.filter(x => !x.archived);
                                        const f = publicFilms.find(x => x.contentId === siteConfig.bannerTargetId || x.id === siteConfig.bannerTargetId);
                                        const b = blogs.find(x => x.contentId === siteConfig.bannerTargetId || x.id === siteConfig.bannerTargetId);
                                        if (f) { setView('films'); setSelectedFilm(f); }
                                        else if (b) { setView('blog'); setSelectedBlog(b); }
                                    }}
                                    className="bg-white text-[var(--accent)] px-3 py-1 rounded-full text-xs hover:bg-black hover:text-white transition-colors"
                                >
                                    View
                                </button>
                            )}
                            <button onClick={() => setBannerDismissed(true)} className="text-white hover:text-black transition-colors"><X size={16} /></button>
                        </div>
                    )}
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
                    {currentView === 'contact' && <ContactView siteConfig={siteConfig} />}
                    {currentView === 'archives' && <ArchivesView openModal={setSelectedFilm} films={films} siteConfig={siteConfig} />}
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
                                <button onClick={() => setView('archives')} className={`hover:text-white transition-colors ${currentView === 'archives' ? 'text-white' : ''}`}>Archives</button>
                                <button onClick={() => setView('admin')} className={`hover:text-white transition-colors ${currentView === 'admin' ? 'text-white' : ''}`}>Admin</button>
                            </div>
                        </div>
                    </footer>
                </div>
            );
        }

        