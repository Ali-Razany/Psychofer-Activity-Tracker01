with open('firestore.rules', 'r') as f:
    content = f.read()

new_rules = """
    match /telegram_links/{docId} {
      allow read, write: if true;
    }
  }
}
"""
content = content.replace("  }\n}", new_rules)

with open('firestore.rules', 'w') as f:
    f.write(content)
