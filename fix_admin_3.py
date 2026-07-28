with open('script.jsx', 'r') as f:
    content = f.read()

# 1. Update initial state
content = content.replace("const [filmForm, setFilmForm] = useState({", "const [filmForm, setFilmForm] = useState({ contentId: '',")
content = content.replace("const [blogForm, setBlogForm] = useState({", "const [blogForm, setBlogForm] = useState({ contentId: '',")

# 2. Update reset in saveFilm / saveBlog
content = content.replace("setFilmForm({ title: '', tagline: ''", "setFilmForm({ contentId: '', title: '', tagline: ''")
content = content.replace("setBlogForm({ title: '', date: ", "setBlogForm({ contentId: '', title: '', date: ")
content = content.replace("setBlogForm({ title: '', date: new Date().toLocaleDateString()", "setBlogForm({ contentId: '', title: '', date: new Date().toLocaleDateString()")

# 3. Update load in edit button
# Film
old_film_edit = "setFilmForm({ "
new_film_edit = "setFilmForm({ contentId: f.contentId||'', "
content = content.replace(old_film_edit, new_film_edit)

# Blog
old_blog_edit = "setBlogForm({ "
new_blog_edit = "setBlogForm({ contentId: b.contentId||'', "
content = content.replace(old_blog_edit, new_blog_edit)

# 4. Update save data payload
old_film_data = "const data = {\n                        title: filmForm.title,"
new_film_data = "const data = {\n                        contentId: filmForm.contentId,\n                        title: filmForm.title,"
content = content.replace(old_film_data, new_film_data)

old_blog_data = "const data = {\n                        title: blogForm.title,"
new_blog_data = "const data = {\n                        contentId: blogForm.contentId,\n                        title: blogForm.title,"
content = content.replace(old_blog_data, new_blog_data)

with open('script.jsx', 'w') as f:
    f.write(content)
