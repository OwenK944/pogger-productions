import re
with open('script.jsx', 'r') as f:
    content = f.read()

# Revert the double contentId
content = content.replace("contentId: f.contentId||'', contentId: '', ", "contentId: '', ")
content = content.replace("contentId: b.contentId||'', contentId: '', ", "contentId: '', ")

with open('script.jsx', 'w') as f:
    f.write(content)
