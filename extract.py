with open('index.html', 'r') as f:
    content = f.read()

start_idx = content.find('// --- YOUR EXACT CODE STARTS HERE ---')
end_idx = content.find('// --- YOUR EXACT CODE ENDS HERE ---')

if start_idx != -1 and end_idx != -1:
    with open('script.jsx', 'w') as f:
        f.write(content[start_idx:end_idx])
    print("Extracted script.jsx")
else:
    print("Could not find boundaries")
