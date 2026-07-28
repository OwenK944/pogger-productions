import re

with open('script.jsx', 'r') as f:
    content = f.read()

# Replace film delete button
old_film_del = '<button onClick={() => deleteDocPrompt(\'films\', f.id)} className="text-gray-400 hover:text-[var(--accent)]"><Trash2 size={16} /></button>'
new_film_del = '<ConfirmDeleteButton onConfirm={() => deleteDoc(doc(db, "films", f.id))} />'
content = content.replace(old_film_del, new_film_del)

# Replace blog delete button
old_blog_del = '<button onClick={() => deleteDocPrompt(\'blogs\', b.id)} className="text-gray-400 hover:text-[var(--accent)]"><Trash2 size={16} /></button>'
new_blog_del = '<ConfirmDeleteButton onConfirm={() => deleteDoc(doc(db, "blogs", b.id))} />'
content = content.replace(old_blog_del, new_blog_del)

with open('script.jsx', 'w') as f:
    f.write(content)
