import re
with open('script.jsx', 'r') as f:
    content = f.read()

contact_msgs_code = """
        const ContactMessagesView = () => {
            const [messages, setMessages] = useState([]);
            useEffect(() => {
                const q = collection(db, 'messages');
                const unsub = onSnapshot(q, (snap) => {
                    setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.createdAt - a.createdAt));
                });
                return () => unsub();
            }, []);
            return (
                <div className="space-y-4">
                    {messages.length === 0 ? <p className="text-gray-400">No messages yet.</p> : messages.map(m => (
                        <div key={m.id} className="bg-[#0a0a0a] p-6 border border-gray-800 rounded">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-white font-bold text-lg">{m.name}</h4>
                                    <a href={`mailto:${m.email}`} className="text-[var(--accent)] text-sm">{m.email}</a>
                                </div>
                                <span className="text-gray-500 text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{m.message}</p>
                        </div>
                    ))}
                </div>
            );
        };
"""

content = content.replace("const AdminView = ({ films, blogs, siteConfig }) => {", contact_msgs_code + "\n        const AdminView = ({ films, blogs, siteConfig }) => {")

with open('script.jsx', 'w') as f:
    f.write(content)
