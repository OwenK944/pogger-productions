import re

with open('script.jsx', 'r') as f:
    content = f.read()

old_banner = """                            {siteConfig.bannerTargetId && (
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
                            )}"""

new_banner = """                            {siteConfig.bannerTargetId && (
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
                            )}"""

content = content.replace(old_banner, new_banner)

with open('script.jsx', 'w') as f:
    f.write(content)
