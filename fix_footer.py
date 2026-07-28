import re

with open('script.jsx', 'r') as f:
    content = f.read()

old_footer_btns = """                            <div className="flex gap-8">
                                <button onClick={() => setView('admin')} className={`hover:text-white transition-colors ${currentView === 'admin' ? 'text-white' : ''}`}>Admin</button>
                            </div>"""

new_footer_btns = """                            <div className="flex gap-8">
                                <button onClick={() => setView('archives')} className={`hover:text-white transition-colors ${currentView === 'archives' ? 'text-white' : ''}`}>Archives</button>
                                <button onClick={() => setView('admin')} className={`hover:text-white transition-colors ${currentView === 'admin' ? 'text-white' : ''}`}>Admin</button>
                            </div>"""
content = content.replace(old_footer_btns, new_footer_btns)

# Also add the new view to the App return
old_admin_view = "{currentView === 'admin' && <AdminView films={films} blogs={blogs} siteConfig={siteConfig} />}"
new_admin_view = "{currentView === 'archives' && <ArchivesView openModal={setSelectedFilm} films={films} siteConfig={siteConfig} />}\n                    {currentView === 'admin' && <AdminView films={films} blogs={blogs} siteConfig={siteConfig} />}"
content = content.replace(old_admin_view, new_admin_view)

with open('script.jsx', 'w') as f:
    f.write(content)
