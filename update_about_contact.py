import re

with open('script.jsx', 'r') as f:
    content = f.read()

# 1. Update About View dynamic paragraphs
old_about_grid = """                    {/* Generic Content Sections */}
                    <div className="max-w-5xl mx-auto px-6 mb-24 grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="font-display text-3xl font-bold text-white mb-6">Company History</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {siteConfig.aboutHistory}
                            </p>
                        </div>
                        <div>
                            <h2 className="font-display text-3xl font-bold text-white mb-6">Pogger?</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {siteConfig.aboutVision}
                            </p>
                        </div>
                    </div>"""

new_about_grid = """                    {/* Generic Content Sections */}
                    <div className="max-w-5xl mx-auto px-6 mb-24 grid md:grid-cols-2 gap-16">
                        {(siteConfig.aboutParagraphs || [
                            { title: 'Company History', content: siteConfig.aboutHistory || '' },
                            { title: 'Pogger?', content: siteConfig.aboutVision || '' }
                        ]).map((para, i) => (
                            <div key={i}>
                                <h2 className="font-display text-3xl font-bold text-white mb-6">{para.title}</h2>
                                <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                                    {para.content}
                                </p>
                            </div>
                        ))}
                    </div>"""

content = content.replace(old_about_grid, new_about_grid)

# 2. Add Contact View Component
contact_view_code = """
        const ContactView = ({ siteConfig }) => {
            const [form, setForm] = useState({ name: '', email: '', message: '' });
            const [status, setStatus] = useState('');
            const submitContact = async (e) => {
                e.preventDefault();
                setStatus('sending');
                try {
                    await addDoc(collection(db, 'messages'), { ...form, createdAt: Date.now() });
                    setStatus('sent');
                    setForm({ name: '', email: '', message: '' });
                    setTimeout(() => setStatus(''), 5000);
                } catch(err) {
                    setStatus('error');
                }
            };
            return (
                <div className="min-h-screen pt-32 pb-20 animate-fade-in flex flex-col md:flex-row max-w-7xl mx-auto px-6 gap-16">
                    <div className="flex-1">
                        <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-6">Get In Touch</h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">Whether you have a project in mind, want to collaborate, or just want to say hi, we'd love to hear from you.</p>
                        
                        {siteConfig.contactEmail && (
                            <div className="mb-12">
                                <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Email</h3>
                                <a href={`mailto:${siteConfig.contactEmail}`} className="text-2xl text-[var(--accent)] hover:text-white transition-colors">{siteConfig.contactEmail}</a>
                            </div>
                        )}
                        {siteConfig.contactPhone && (
                            <div className="mb-12">
                                <h3 className="font-display text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Phone</h3>
                                <p className="text-2xl text-white">{siteConfig.contactPhone}</p>
                            </div>
                        )}
                        
                        <form onSubmit={submitContact} className="space-y-6">
                            <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors" />
                            <input type="email" placeholder="Your Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors" />
                            <textarea placeholder="Your Message" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-[#111] border border-gray-800 text-white p-4 rounded focus:border-[var(--accent)] outline-none transition-colors min-h-[200px]"></textarea>
                            <button type="submit" disabled={status === 'sending'} className="bg-[var(--accent)] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm rounded hover:bg-white hover:text-black transition-colors w-full md:w-auto">
                                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                            </button>
                            {status === 'error' && <p className="text-red-500 mt-2">Failed to send message. Please try again.</p>}
                        </form>
                    </div>
                    {siteConfig.contactImage && (
                        <div className="flex-1 hidden md:block">
                            <img src={siteConfig.contactImage} alt="Contact" className="w-full h-full object-cover rounded grayscale hover:grayscale-0 transition-all duration-1000" />
                        </div>
                    )}
                </div>
            );
        };
"""

content = content.replace("const AdminView = ({ films, blogs, siteConfig }) => {", contact_view_code + "\n        const AdminView = ({ films, blogs, siteConfig }) => {")

# 3. Add Contact to Nav
content = content.replace("{ id: 'about', label: 'About' }", "{ id: 'about', label: 'About' },\n                { id: 'contact', label: 'Contact' }")
content = content.replace("{currentView === 'about' && <AboutView siteConfig={siteConfig} />}", "{currentView === 'about' && <AboutView siteConfig={siteConfig} />}\n                    {currentView === 'contact' && <ContactView siteConfig={siteConfig} />}")

with open('script.jsx', 'w') as f:
    f.write(content)
