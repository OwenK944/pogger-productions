import re

with open('index.html', 'r') as f:
    content = f.read()

with open('adminViewDraft.jsx', 'r') as f:
    admin_draft = f.read()

with open('appDraft.jsx', 'r') as f:
    app_draft = f.read()

# Find start of AdminView
admin_start = content.find('const AdminView =')
# Find end of App
app_end = content.find('// --- YOUR EXACT CODE ENDS HERE ---')

if admin_start != -1 and app_end != -1:
    new_content = content[:admin_start] + admin_draft + '\n' + app_draft + '\n        ' + content[app_end:]
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Fixed!")
else:
    print("Could not find markers")
