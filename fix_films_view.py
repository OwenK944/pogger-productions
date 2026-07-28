import re

with open('script.jsx', 'r') as f:
    content = f.read()

# Make FilmsView only show non-archived films
old_films_map = "{films.map((film, i) => ("
new_films_map = "{films.filter(f => !f.archived).map((film, i) => ("
content = content.replace(old_films_map, new_films_map)

with open('script.jsx', 'w') as f:
    f.write(content)
