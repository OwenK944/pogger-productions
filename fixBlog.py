with open('index.html', 'r') as f:
    content = f.read()

# Replace in BlogView
content = content.replace(
    '<p className="text-gray-400 line-clamp-3 mb-6">{blog.content[0]}</p>',
    '<div className="text-gray-400 line-clamp-3 mb-6 prose prose-invert"><ReactMarkdown>{Array.isArray(blog.content) ? blog.content[0] : blog.content}</ReactMarkdown></div>'
)

# Replace in BlogModal
old_modal_content = '''                         <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light font-serif">
                            {post.content.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>'''

new_modal_content = '''                         <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light font-serif prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-[var(--accent)]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {Array.isArray(post.content) ? post.content.join('\\n\\n') : post.content}
                            </ReactMarkdown>
                        </div>'''

content = content.replace(old_modal_content, new_modal_content)

with open('index.html', 'w') as f:
    f.write(content)
