with open('script.jsx', 'r') as f:
    content = f.read()

# Fix sorting
content = content.replace(".sort((a, b) => b.createdAt - a.createdAt);", ".sort((a, b) => (a.order || 0) - (b.order || 0));")

with open('script.jsx', 'w') as f:
    f.write(content)
