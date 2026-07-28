with open('script.jsx', 'r') as f:
    content = f.read()

dnd_code = """
            // Drag and drop state
            const [draggedFilmIdx, setDraggedFilmIdx] = useState(null);
            const [draggedBlogIdx, setDraggedBlogIdx] = useState(null);

            const handleFilmDrop = async (e, idx) => {
                e.preventDefault();
                if (draggedFilmIdx === null || draggedFilmIdx === idx) return;
                const newFilms = [...films];
                const item = newFilms.splice(draggedFilmIdx, 1)[0];
                newFilms.splice(idx, 0, item);
                setDraggedFilmIdx(null);
                setLoading(true);
                try {
                    await Promise.all(newFilms.map((f, i) => updateDoc(doc(db, 'films', f.id), { order: i })));
                } catch(err) { console.error(err); }
                setLoading(false);
            };

            const handleBlogDrop = async (e, idx) => {
                e.preventDefault();
                if (draggedBlogIdx === null || draggedBlogIdx === idx) return;
                const newBlogs = [...blogs];
                const item = newBlogs.splice(draggedBlogIdx, 1)[0];
                newBlogs.splice(idx, 0, item);
                setDraggedBlogIdx(null);
                setLoading(true);
                try {
                    await Promise.all(newBlogs.map((b, i) => updateDoc(doc(db, 'blogs', b.id), { order: i })));
                } catch(err) { console.error(err); }
                setLoading(false);
            };
"""

content = content.replace("const [user, setUser] = useState(null);", "const [user, setUser] = useState(null);\n" + dnd_code)

with open('script.jsx', 'w') as f:
    f.write(content)
