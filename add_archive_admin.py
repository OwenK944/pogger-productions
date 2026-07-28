import re
with open('script.jsx', 'r') as f:
    content = f.read()

# Edit film loading
content = content.replace("createdAt: f.createdAt\n                });", "createdAt: f.createdAt,\n                    archived: !!f.archived\n                });")

# Save film data
old_save = "awards: filmForm.awards.split('\\n').filter(Boolean),"
new_save = "awards: filmForm.awards.split('\\n').filter(Boolean),\n                        archived: !!filmForm.archived,"
content = content.replace(old_save, new_save)

# Reset form
content = content.replace("extraFeatureLabel: '' });", "extraFeatureLabel: '', archived: false });")

# UI toggle
old_film_inputs = '<input type="text" placeholder="Title" value={filmForm.title}'
new_film_inputs = """                                    <div className="col-span-2 flex items-center gap-4 bg-[#0a0a0a] border border-gray-700 p-4 rounded mb-2">
                                        <input type="checkbox" id="archived" checked={filmForm.archived||false} onChange={e => setFilmForm({...filmForm, archived: e.target.checked})} className="w-5 h-5 accent-[var(--accent)] cursor-pointer" />
                                        <div>
                                            <label htmlFor="archived" className="text-white font-bold cursor-pointer">Archive Film</label>
                                            <p className="text-xs text-gray-400">Archived films are only visible to authorized emails via the Archives view.</p>
                                        </div>
                                    </div>
                                    <input type="text" placeholder="Title" value={filmForm.title}"""
content = content.replace(old_film_inputs, new_film_inputs)

# Mark as archived in existing films list
content = content.replace('<span className="font-bold truncate">{f.title}</span>', '<span className="font-bold truncate">{f.title} {f.archived && <span className="text-xs text-[var(--accent)] border border-[var(--accent)] px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Archived</span>}</span>')

with open('script.jsx', 'w') as f:
    f.write(content)
