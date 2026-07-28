with open('index.html', 'r') as f:
    content = f.read()

# Remove react-markdown and remark-gfm from import map
content = content.replace('"react-markdown": "https://esm.sh/react-markdown@9.0.1",', '"marked": "https://esm.sh/marked",')
content = content.replace('"remark-gfm": "https://esm.sh/remark-gfm@4.0.0"', '')

# Remove trailing comma from import map if needed
content = content.replace('"marked": "https://esm.sh/marked",\n            \n        }', '"marked": "https://esm.sh/marked"\n        }')


# Replace imports
content = content.replace("import ReactMarkdown from 'react-markdown';", "import { marked } from 'marked';")
content = content.replace("import remarkGfm from 'remark-gfm';", "")

# Fix BlogView markdown
old_blog_view = '<div className="text-gray-400 line-clamp-3 mb-6 prose prose-invert"><ReactMarkdown>{Array.isArray(blog.content) ? blog.content[0] : blog.content}</ReactMarkdown></div>'
new_blog_view = '<div className="text-gray-400 line-clamp-3 mb-6 prose prose-invert" dangerouslySetInnerHTML={{ __html: marked.parse(Array.isArray(blog.content) ? blog.content[0] : blog.content) }}></div>'
content = content.replace(old_blog_view, new_blog_view)

# Fix BlogModal markdown
old_blog_modal = '''                         <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light font-serif prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent)]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {Array.isArray(post.content) ? post.content.join('\\n\\n') : post.content}
                            </ReactMarkdown>
                        </div>'''
new_blog_modal = '''                         <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light font-serif prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent)]" dangerouslySetInnerHTML={{ __html: marked.parse(Array.isArray(post.content) ? post.content.join('\\n\\n') : post.content) }}></div>'''
content = content.replace(old_blog_modal, new_blog_modal)

with open('index.html', 'w') as f:
    f.write(content)
