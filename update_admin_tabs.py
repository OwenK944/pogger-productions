import re

with open('script.jsx', 'r') as f:
    content = f.read()

# 1. Update activeTab buttons
old_tabs = """                        <button onClick={() => { setActiveTab('settings'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'settings' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Settings</button>
                        <button onClick={() => { setActiveTab('films'); setEditingId(null); setFilmForm({ contentId: '', title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'films' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Films</button>
                        <button onClick={() => { setActiveTab('blogs'); setEditingId(null); setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'blogs' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Blogs</button>"""

new_tabs = """                        <button onClick={() => { setActiveTab('settings'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'settings' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Settings</button>
                        <button onClick={() => { setActiveTab('about'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'about' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>About</button>
                        <button onClick={() => { setActiveTab('contact'); setEditingId(null); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'contact' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Contact</button>
                        <button onClick={() => { setActiveTab('films'); setEditingId(null); setFilmForm({ contentId: '', title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '', archived: false }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'films' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Films</button>
                        <button onClick={() => { setActiveTab('blogs'); setEditingId(null); setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'blogs' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Blogs</button>"""

content = content.replace(old_tabs, new_tabs)

with open('script.jsx', 'w') as f:
    f.write(content)
