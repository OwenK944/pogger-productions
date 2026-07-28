import re

with open('script.jsx', 'r') as f:
    content = f.read()

old_home_view = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const publicFilms = films.filter(f => !f.archived);
            const filmFeature = publicFilms.find(f => f.contentId === siteConfig.featured || f.id === siteConfig.featured);
            const blogFeature = blogs.find(b => b.contentId === siteConfig.featured || b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || publicFilms[0];
            const isFilm = activeFeature === filmFeature || (!filmFeature && !blogFeature && activeFeature === publicFilms[0]);

            return (
                <div className="min-h-screen">
                    <div className="relative w-full h-screen overflow-hidden">
                        <img 
                            src={activeFeature.image} 
                            alt="Hero" 
                            className="w-full h-full object-cover slow-zoom"
                        />"""

new_home_view = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
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
                        />"""

content = content.replace(old_home_view, new_home_view)

with open('script.jsx', 'w') as f:
    f.write(content)
