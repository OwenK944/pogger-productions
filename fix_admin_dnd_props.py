with open('script.jsx', 'r') as f:
    content = f.read()

# Film Drag and Drop
old_film_map = '{films.map(f => (\n                                    <div key={f.id} className="bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center">'
new_film_map = '{films.map((f, idx) => (\n                                    <div key={f.id} draggable onDragStart={(e) => { setDraggedFilmIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleFilmDrop(e, idx)} className={`bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center cursor-move transition-opacity ${draggedFilmIdx === idx ? "opacity-50" : "opacity-100"}`}>'
content = content.replace(old_film_map, new_film_map)

# Blog Drag and Drop
old_blog_map = '{blogs.map(b => (\n                                    <div key={b.id} className="bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center">'
new_blog_map = '{blogs.map((b, idx) => (\n                                    <div key={b.id} draggable onDragStart={(e) => { setDraggedBlogIdx(idx); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleBlogDrop(e, idx)} className={`bg-[#111] p-4 rounded border border-gray-800 flex justify-between items-center cursor-move transition-opacity ${draggedBlogIdx === idx ? "opacity-50" : "opacity-100"}`}>'
content = content.replace(old_blog_map, new_blog_map)

with open('script.jsx', 'w') as f:
    f.write(content)
