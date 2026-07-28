with open('index.html', 'r') as f:
    content = f.read()

with open('script.jsx', 'r') as f:
    script_content = f.read()

start_marker = '// --- YOUR EXACT CODE STARTS HERE ---'
end_marker = '// --- YOUR EXACT CODE ENDS HERE ---'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx + len(start_marker)] + '\n' + script_content + '\n        ' + content[end_idx:]
    with open('index.html', 'w') as f:
        f.write(new_content)
    print("Rebuilt index.html")
else:
    print("Could not find boundaries")
