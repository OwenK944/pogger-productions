import re

with open('script.jsx', 'r') as f:
    content = f.read()

# First, define the new sections
settings_tab = """                    {activeTab === 'settings' && (
                        <div className="space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800 animate-fade-in">
                            <h2 className="font-display text-2xl text-white mb-6">Site Configuration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Global Banner Text (Leave empty to hide)</label>
                                    <input type="text" placeholder="e.g. New Film Out Now!" value={localConfig.bannerText||''} onChange={e => setLocalConfig({...localConfig, bannerText: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Banner Target Content ID (Optional)</label>
                                    <input type="text" placeholder="e.g. lightfall" value={localConfig.bannerTargetId||''} onChange={e => setLocalConfig({...localConfig, bannerTargetId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
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
                                <div className="col-span-2 border-t border-gray-800 pt-6 mt-2">
                                    <h4 className="text-sm text-[var(--accent)] font-bold mb-4 uppercase tracking-widest">Archive Access Configuration</h4>
                                    <label className="block text-sm text-gray-400 mb-2">Allowed Archive Emails (One per line)</label>
                                    <textarea placeholder="e.g. family@gmail.com\\nfriend@yahoo.com" value={Array.isArray(localConfig.allowedArchiveEmails) ? localConfig.allowedArchiveEmails.join('\\n') : (localConfig.allowedArchiveEmails||'')} onChange={e => setLocalConfig({...localConfig, allowedArchiveEmails: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[100px]"></textarea>
                                    <p className="text-xs text-gray-500 mt-2">These users can sign in with Google to view archived films.</p>
                                </div>
                            </div>
                            <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}"""

about_tab = """                    {activeTab === 'about' && (
                        <div className="space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800 animate-fade-in">
                            <h2 className="font-display text-2xl text-white mb-6">About Page</h2>
                            
                            <div className="space-y-4 mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Content Paragraphs</h3>
                                {(localConfig.aboutParagraphs || []).map((para, idx) => (
                                    <div key={idx} className="bg-[#0a0a0a] p-4 border border-gray-800 rounded relative group">
                                        <input type="text" placeholder="Title" value={para.title} onChange={e => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP[idx].title = e.target.value;
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="w-full bg-transparent text-white font-bold mb-2 outline-none border-b border-gray-800 focus:border-[var(--accent)]" />
                                        <textarea placeholder="Content" value={para.content} onChange={e => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP[idx].content = e.target.value;
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="w-full bg-transparent text-gray-400 outline-none min-h-[100px]"></textarea>
                                        <button onClick={() => {
                                            const newP = [...localConfig.aboutParagraphs];
                                            newP.splice(idx, 1);
                                            setLocalConfig({...localConfig, aboutParagraphs: newP});
                                        }} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                                <button onClick={() => setLocalConfig({...localConfig, aboutParagraphs: [...(localConfig.aboutParagraphs||[]), {title: '', content: ''}]})} className="text-sm text-[var(--accent)] font-bold hover:text-white flex items-center gap-1"><Plus size={16}/> Add Paragraph</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Awards (One per line)</label>
                                    <textarea value={Array.isArray(localConfig.aboutAwards) ? localConfig.aboutAwards.join('\\n') : localConfig.aboutAwards} onChange={e => setLocalConfig({...localConfig, aboutAwards: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded min-h-[150px]"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-4 uppercase tracking-widest">Gallery Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {(localConfig.aboutGallery || []).map((img, idx) => (
                                            <div key={idx} draggable onDragStart={(e) => { setDraggedGalleryIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleGalleryDrop(e, idx)} className={`relative aspect-[16/9] group rounded overflow-hidden cursor-move border border-gray-700 transition-opacity ${draggedGalleryIdx === idx ? 'opacity-50' : 'opacity-100'}`}>
                                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <label className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 aspect-[16/9] rounded cursor-pointer transition-colors w-full">
                                            <Upload size={20} />
                                            <span className="font-mono text-xs uppercase text-center px-2">Upload</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">Drag and drop images to re-arrange them.</p>
                                </div>
                            </div>
                            <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}"""

contact_tab = """                    {activeTab === 'contact' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-[#111] p-8 rounded-lg border border-gray-800">
                                <h2 className="font-display text-2xl text-white mb-6">Contact Page Config</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                                        <input type="email" placeholder="e.g. contact@pogger.com" value={localConfig.contactEmail||''} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Contact Phone</label>
                                        <input type="text" placeholder="e.g. +1 234 567 8900" value={localConfig.contactPhone||''} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Contact Page Image</label>
                                        <div className="flex gap-4 items-center">
                                            {localConfig.contactImage && <img src={localConfig.contactImage} className="w-24 h-24 object-cover rounded border border-gray-700" alt="Contact" />}
                                            <label className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-dashed border-gray-700 text-gray-300 px-4 py-2 rounded cursor-pointer transition-colors">
                                                <Upload size={16} /> <span className="font-mono text-sm uppercase">Upload Image</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                    if(e.target.files[0]) {
                                                        const img = await compressImage(e.target.files[0]);
                                                        setLocalConfig({...localConfig, contactImage: img});
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={saveSiteConfig} disabled={loading} className="w-full bg-[var(--accent)] text-white font-bold p-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 mt-8">
                                    {loading ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                            
                            <div className="bg-[#111] p-8 rounded-lg border border-gray-800">
                                <h2 className="font-display text-2xl text-white mb-6">Contact Messages</h2>
                                <ContactMessagesView />
                            </div>
                        </div>
                    )}"""


# Replace the old activeTab === 'settings' with the three tabs.
# It's safest to find where it starts and ends.
start_idx = content.find("{activeTab === 'settings' && (")
if start_idx != -1:
    # Need to find the end of the settings block.
    # It ends with:
    #                            </button>
    #                        </div>
    #                    )}
    end_str = "                        </div>\n                    )}"
    end_idx = content.find(end_str, start_idx) + len(end_str)
    
    # We replace from start_idx to end_idx
    new_tabs_combined = settings_tab + "\n" + about_tab + "\n" + contact_tab
    content = content[:start_idx] + new_tabs_combined + content[end_idx:]
    
    with open('script.jsx', 'w') as f:
        f.write(content)
    print("Replaced admin tabs")
else:
    print("Could not find settings tab")
