with open('script.jsx', 'r') as f:
    content = f.read()

# Add contentId to editFilm
content = content.replace("title: f.title||'', tagline: f.tagline||''", "contentId: f.contentId||'', title: f.title||'', tagline: f.tagline||''")

# Add contentId to editBlog
content = content.replace("title: b.title||'', date: b.date||''", "contentId: b.contentId||'', title: b.title||'', date: b.date||''")

with open('script.jsx', 'w') as f:
    f.write(content)
