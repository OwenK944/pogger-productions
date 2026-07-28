import re

with open('script.jsx', 'r') as f:
    content = f.read()

# Fix HomeView
old_home_view = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const filmFeature = films.find(f => f.contentId === siteConfig.featured || f.id === siteConfig.featured);
            const blogFeature = blogs.find(b => b.contentId === siteConfig.featured || b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || films[0];
            const isFilm = activeFeature === filmFeature || (!filmFeature && !blogFeature && activeFeature === films[0]);"""

new_home_view = """        const HomeView = ({ setView, openFilm, openBlog, films, blogs, siteConfig }) => {
            const publicFilms = films.filter(f => !f.archived);
            const filmFeature = publicFilms.find(f => f.contentId === siteConfig.featured || f.id === siteConfig.featured);
            const blogFeature = blogs.find(b => b.contentId === siteConfig.featured || b.id === siteConfig.featured);
            const activeFeature = filmFeature || blogFeature || publicFilms[0];
            const isFilm = activeFeature === filmFeature || (!filmFeature && !blogFeature && activeFeature === publicFilms[0]);"""

content = content.replace(old_home_view, new_home_view)

# Fix FilmsView
old_films_view = """        const FilmsView = ({ openModal, films }) => {
            const [viewMode, setViewMode] = useState('massive'); // 'massive' or 'grid'
            const [filterOpen, setFilterOpen] = useState(false);
            const [activeFilter, setActiveFilter] = useState('All');
            const [searchTerm, setSearchTerm] = useState('');

            const allTags = ['All', ...new Set(films.flatMap(f => f.tags || []))];
            
            const filteredFilms = films.filter(f => {
                const matchesTag = activeFilter === 'All' || (f.tags && f.tags.includes(activeFilter));
                const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesTag && matchesSearch;
            });"""

new_films_view = """        const FilmsView = ({ openModal, films }) => {
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
            });"""

content = content.replace(old_films_view, new_films_view)

with open('script.jsx', 'w') as f:
    f.write(content)
