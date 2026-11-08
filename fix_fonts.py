import os
import re

for file in os.listdir('src/components'):
    if file.endswith('.tsx'):
        with open('src/components/' + file, 'r') as f:
            content = f.read()
        
        # Replace non-responsive large text classes with responsive ones
        content = content.replace('text-2xl font-bold', 'text-xl md:text-2xl font-bold')
        content = content.replace('text-2xl md:text-3xl', 'text-xl md:text-3xl')
        content = content.replace('text-3xl font-bold', 'text-2xl md:text-3xl font-bold')
        content = content.replace('text-4xl', 'text-3xl md:text-4xl')
        content = content.replace('text-5xl', 'text-4xl md:text-5xl')
        
        # Exceptions or fixes to avoid double classes like 'text-xl md:text-xl md:text-2xl font-bold'
        content = content.replace('text-xl md:text-xl', 'text-xl')
        
        with open('src/components/' + file, 'w') as f:
            f.write(content)
