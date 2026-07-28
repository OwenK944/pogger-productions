import re
with open('script.jsx', 'r') as f:
    content = f.read()

old_save = "if (typeof dataToSave.aboutAwards === 'string') dataToSave.aboutAwards = dataToSave.aboutAwards.split('\\n').filter(Boolean);"
new_save = "if (typeof dataToSave.aboutAwards === 'string') dataToSave.aboutAwards = dataToSave.aboutAwards.split('\\n').filter(Boolean);\n                    if (typeof dataToSave.allowedArchiveEmails === 'string') dataToSave.allowedArchiveEmails = dataToSave.allowedArchiveEmails.split('\\n').filter(Boolean);"

content = content.replace(old_save, new_save)
with open('script.jsx', 'w') as f:
    f.write(content)
