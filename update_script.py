import re

with open('script.jsx', 'r') as f:
    content = f.read()

# 1. ADD BANNER STATE & UI
banner_state = """            const [bannerDismissed, setBannerDismissed] = useState(false);
            const [selectedFilm, setSelectedFilm] = useState(null);"""
content = content.replace("            const [selectedFilm, setSelectedFilm] = useState(null);", banner_state)

banner_ui = """                    <style>{styles}</style>
                    
                    {!bannerDismissed && siteConfig.bannerText && (
                        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-[var(--accent)] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-4 text-sm font-bold uppercase tracking-widest animate-fade-in border border-white/20">
                            <span>{siteConfig.bannerText}</span>
                            {siteConfig.bannerTargetId && (
                                <button 
                                    onClick={() => {
                                        const f = films.find(x => x.contentId === siteConfig.bannerTargetId || x.id === siteConfig.bannerTargetId);
                                        const b = blogs.find(x => x.contentId === siteConfig.bannerTargetId || x.id === siteConfig.bannerTargetId);
                                        if (f) { setView('films'); setSelectedFilm(f); }
                                        else if (b) { setView('slate'); setSelectedBlog(b); }
                                    }}
                                    className="bg-white text-[var(--accent)] px-3 py-1 rounded-full text-xs hover:bg-black hover:text-white transition-colors"
                                >
                                    View
                                </button>
                            )}
                            <button onClick={() => setBannerDismissed(true)} className="text-white hover:text-black transition-colors"><X size={16} /></button>
                        </div>
                    )}"""
content = content.replace("                    <style>{styles}</style>", banner_ui)

with open('script.jsx', 'w') as f:
    f.write(content)
