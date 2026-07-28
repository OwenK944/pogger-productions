with open('index.html', 'r') as f:
    content = f.read()

old_tech_specs = '''                                    {film.techSpecs && Object.entries(film.techSpecs).map(([k, v], i) => ('''
new_tech_specs = '''                                    {film.techSpecs && Object.entries(film.techSpecs).filter(([_, v]) => v && v.trim() !== '').map(([k, v], i) => ('''

content = content.replace(old_tech_specs, new_tech_specs)

with open('index.html', 'w') as f:
    f.write(content)
