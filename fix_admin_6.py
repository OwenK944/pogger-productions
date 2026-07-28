with open('script.jsx', 'r') as f:
    content = f.read()

# Add contentId input to Film form
old_film_input = '<input type="text" placeholder="Title" value={filmForm.title}'
new_film_input = '<input type="text" placeholder="Content ID (e.g. featured-1)" value={filmForm.contentId} onChange={e => setFilmForm({...filmForm, contentId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />\n                                    <input type="text" placeholder="Title" value={filmForm.title}'
content = content.replace(old_film_input, new_film_input)

# Add contentId input to Blog form
old_blog_input = '<input type="text" placeholder="Title" value={blogForm.title}'
new_blog_input = '<input type="text" placeholder="Content ID (e.g. blog-feat-1)" value={blogForm.contentId} onChange={e => setBlogForm({...blogForm, contentId: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-3 rounded" />\n                                    <input type="text" placeholder="Title" value={blogForm.title}'
content = content.replace(old_blog_input, new_blog_input)

with open('script.jsx', 'w') as f:
    f.write(content)
