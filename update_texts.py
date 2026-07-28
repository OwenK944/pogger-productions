with open('script.jsx', 'r') as f:
    content = f.read()

# 1. 'The Archives' -> 'Productions'
# Looking for 'The Archives' in the navbar/tab or FilmsView
content = content.replace("The Archives", "Productions")
content = content.replace("THE ARCHIVES", "PRODUCTIONS")
content = content.replace("View Archives", "View All Productions")

# 2. 'Journal' -> 'Slate'
# Be careful not to replace generic variables, look for strings
content = content.replace("'journal'", "'slate'")
content = content.replace("view === 'journal'", "view === 'slate'")
content = content.replace("setView('journal')", "setView('slate')")
content = content.replace(">Journal<", ">Slate<")
content = content.replace('"Journal"', '"Slate"')
content = content.replace("Production Journal", "News & Updates")

with open('script.jsx', 'w') as f:
    f.write(content)
