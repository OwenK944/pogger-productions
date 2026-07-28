with open('script.jsx', 'r') as f:
    content = f.read()

home_old = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const filmFeature = films.find(f => f.id === siteConfig.featured) || films[0];
            const blogFeature = blogs.find(b => b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || films[0];
            const isFilm = !!filmFeature;"""

home_new = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const filmFeature = films.find(f => f.contentId === siteConfig.featured || f.id === siteConfig.featured);
            const blogFeature = blogs.find(b => b.contentId === siteConfig.featured || b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || films[0];
            const isFilm = activeFeature === filmFeature || (!filmFeature && !blogFeature && activeFeature === films[0]);"""

content = content.replace(home_old, home_new)

with open('script.jsx', 'w') as f:
    f.write(content)
