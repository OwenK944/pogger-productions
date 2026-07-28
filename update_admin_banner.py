import re

with open('script.jsx', 'r') as f:
    content = f.read()

# Replace site name input with Banner config
old_site_name = """                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Site Name</label>
                                    <input type="text" value={localConfig.name} onChange={e => setLocalConfig({...localConfig, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>"""

new_banner_inputs = """                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Global Banner Text (Leave empty to hide)</label>
                                    <input type="text" placeholder="e.g. New Film Out Now!" value={localConfig.bannerText||''} onChange={e => setLocalConfig({...localConfig, bannerText: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Banner Target Content ID (Optional)</label>
                                    <input type="text" placeholder="e.g. lightfall" value={localConfig.bannerTargetId||''} onChange={e => setLocalConfig({...localConfig, bannerTargetId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />
                                </div>"""

content = content.replace(old_site_name, new_banner_inputs)

# Default config in App
content = content.replace("name: CONFIG.brand.name", "name: CONFIG.brand.name,\n                bannerText: '',\n                bannerTargetId: ''")

with open('script.jsx', 'w') as f:
    f.write(content)
