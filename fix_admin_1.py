import re

with open('script.jsx', 'r') as f:
    content = f.read()

# 1. Add ConfirmDeleteButton
confirm_button_code = """
        const ConfirmDeleteButton = ({ onConfirm }) => {
            const [confirming, setConfirming] = useState(false);
            return (
                <button 
                    type="button"
                    onClick={() => {
                        if (confirming) {
                            onConfirm();
                        } else {
                            setConfirming(true);
                            setTimeout(() => setConfirming(false), 3000);
                        }
                    }}
                    className={`p-2 rounded transition-colors ${confirming ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-red-500'}`}
                >
                    {confirming ? <Check size={16} /> : <Trash2 size={16} />}
                </button>
            );
        };
"""

content = content.replace("const AdminView = ({ films, blogs, siteConfig }) => {", confirm_button_code + "\n        const AdminView = ({ films, blogs, siteConfig }) => {")

with open('script.jsx', 'w') as f:
    f.write(content)
