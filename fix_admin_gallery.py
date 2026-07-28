with open('script.jsx', 'r') as f:
    content = f.read()

gallery_logic = """
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
"""

content = content.replace("const [draggedBlogIdx, setDraggedBlogIdx] = useState(null);", "const [draggedBlogIdx, setDraggedBlogIdx] = useState(null);\n" + gallery_logic)

gallery_ui_old = """                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">About Page - Gallery Image Base64 URLs (One per line)</label>
                                    <textarea value={Array.isArray(localConfig.aboutGallery) ? localConfig.aboutGallery.join('\\n') : localConfig.aboutGallery} onChange={e => setLocalConfig({...localConfig, aboutGallery: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>"""

gallery_ui_new = """                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-4 uppercase tracking-widest">About Page - Gallery Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {(localConfig.aboutGallery || []).map((img, idx) => (
                                            <div 
                                                key={idx}
                                                draggable 
                                                onDragStart={(e) => { setDraggedGalleryIdx(idx); e.dataTransfer.effectAllowed = "move"; }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => handleGalleryDrop(e, idx)}
                                                className={`relative aspect-[16/9] group rounded overflow-hidden cursor-move border border-gray-700 transition-opacity ${draggedGalleryIdx === idx ? 'opacity-50' : 'opacity-100'}`}
                                            >
                                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 aspect-[16/9] rounded cursor-pointer transition-colors w-full">
                                            <Upload size={20} />
                                            <span className="font-mono text-xs uppercase text-center px-2">Upload Image</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Drag and drop images to re-arrange them.</p>
                                </div>"""

content = content.replace(gallery_ui_old, gallery_ui_new)

# Also remove the line in saveSiteConfig that splits aboutGallery:
# if (typeof dataToSave.aboutGallery === 'string') dataToSave.aboutGallery = dataToSave.aboutGallery.split('\n').filter(Boolean);
content = content.replace("if (typeof dataToSave.aboutGallery === 'string') dataToSave.aboutGallery = dataToSave.aboutGallery.split('\\n').filter(Boolean);", "")

with open('script.jsx', 'w') as f:
    f.write(content)
