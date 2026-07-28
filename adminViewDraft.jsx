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

        const AdminView = ({ films, blogs, siteConfig }) => {
            const [user, setUser] = useState(null);
            const [activeTab, setActiveTab] = useState('settings');
            const [loading, setLoading] = useState(false);
            
            // Site Settings
            const [localConfig, setLocalConfig] = useState(siteConfig);

            // Sync if prop updates
            useEffect(() => { setLocalConfig(siteConfig); }, [siteConfig]);

            // Forms
            const [editingId, setEditingId] = useState(null);
            const [filmForm, setFilmForm] = useState({
                title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '',
                youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '',
                audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: ''
            });
            const [blogForm, setBlogForm] = useState({
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
                    if (typeof dataToSave.aboutGallery === 'string') dataToSave.aboutGallery = dataToSave.aboutGallery.split('\n').filter(Boolean);

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
                    setFilmForm({ title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '' });
                } catch (e) { alert('Error: ' + e.message); }
                setLoading(false);
            };

            const saveBlog = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const data = {
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
                    setBlogForm({ title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' });
                } catch (e) { alert('Error: ' + e.message); }
                setLoading(false);
            };

            const editFilm = (f) => {
                setEditingId(f.id);
                setFilmForm({
                    title: f.title||'', tagline: f.tagline||'', category: f.category||'', tags: (f.tags||[]).join(', '),
                    releaseDate: f.releaseDate||'', rating: f.rating||'', runtime: f.runtime||'', youtubeId: f.youtubeId||'',
                    description: f.description||'', directorNote: f.directorNote||'', location: f.techSpecs?.location||'',
                    camera: f.techSpecs?.camera||'', lens: f.techSpecs?.lens||'', aspectRatio: f.techSpecs?.aspectRatio||'',
                    audio: f.techSpecs?.audio||'', software: f.techSpecs?.software||'', productionTime: f.techSpecs?.productionTime||'',
                    awards: (f.awards||[]).join('\n'), credits: (f.keyCredits||[]).map(c=>`${c.role}:${c.name}`).join('\n'),
                    image: f.image||'', extraFeatureId: f.extraFeature?.id||'', extraFeatureLabel: f.extraFeature?.label||'',
                    createdAt: f.createdAt
                });
            };

            const editBlog = (b) => {
                setEditingId(b.id);
                setBlogForm({
                    title: b.title||'', date: b.date||'', category: b.category||'', tags: (b.tags||[]).join(', '),
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
                        <button onClick={() => { setActiveTab('films'); setEditingId(null); setFilmForm({ title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'films' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Films</button>
                        <button onClick={() => { setActiveTab('blogs'); setEditingId(null); setBlogForm({ title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className={`px-6 py-3 font-bold uppercase tracking-widest text-sm rounded whitespace-nowrap ${activeTab === 'blogs' ? 'bg-[var(--accent)] text-white' : 'border border-gray-800 text-gray-400'}`}>Blogs</button>
                    </div>

                    {activeTab === 'settings' && (
                        <div className="space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
                            <h2 className="font-display text-2xl text-white mb-6">Site Configuration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Site Name</label>
                                    <input type="text" value={localConfig.name} onChange={e => setLocalConfig({...localConfig, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
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
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">About Page - History</label>
                                    <textarea value={localConfig.aboutHistory} onChange={e => setLocalConfig({...localConfig, aboutHistory: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">About Page - Vision</label>
                                    <textarea value={localConfig.aboutVision} onChange={e => setLocalConfig({...localConfig, aboutVision: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">About Page - Awards (One per line)</label>
                                    <textarea value={Array.isArray(localConfig.aboutAwards) ? localConfig.aboutAwards.join('\n') : localConfig.aboutAwards} onChange={e => setLocalConfig({...localConfig, aboutAwards: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">About Page - Gallery Image Base64 URLs (One per line)</label>
                                    <textarea value={Array.isArray(localConfig.aboutGallery) ? localConfig.aboutGallery.join('\n') : localConfig.aboutGallery} onChange={e => setLocalConfig({...localConfig, aboutGallery: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                            </div>
                            <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'films' && (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Existing Films</h3>
                                {films.map(f => (
                                    <div key={f.id} className="bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center">
                                        <span className="font-bold truncate">{f.title}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => editFilm(f)} className="text-gray-400 hover:text-white"><Check size={16} /></button>
                                            <button onClick={() => deleteDocPrompt('films', f.id)} className="text-gray-400 hover:text-[var(--accent)]"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={saveFilm} className="md:col-span-2 space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-display text-2xl text-white">{editingId ? 'Edit Film' : 'New Film'}</h2>
                                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFilmForm({ title: '', tagline: '', category: '', tags: '', releaseDate: '', rating: '', runtime: '', youtubeId: '', description: '', directorNote: '', location: '', camera: '', lens: '', aspectRatio: '', audio: '', software: '', productionTime: '', awards: '', credits: '', image: '', extraFeatureId: '', extraFeatureLabel: '' }); }} className="text-sm text-gray-400 hover:text-white">Cancel Edit</button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
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
                                {blogs.map(b => (
                                    <div key={b.id} className="bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center">
                                        <span className="font-bold truncate">{b.title}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => editBlog(b)} className="text-gray-400 hover:text-white"><Check size={16} /></button>
                                            <button onClick={() => deleteDocPrompt('blogs', b.id)} className="text-gray-400 hover:text-[var(--accent)]"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={saveBlog} className="md:col-span-2 space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-display text-2xl text-white">{editingId ? 'Edit Blog' : 'New Blog'}</h2>
                                    {editingId && <button type="button" onClick={() => { setEditingId(null); setBlogForm({ title: '', date: new Date().toLocaleDateString(), category: '', tags: '', content: '', image: '' }); }} className="text-sm text-gray-400 hover:text-white">Cancel Edit</button>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
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
