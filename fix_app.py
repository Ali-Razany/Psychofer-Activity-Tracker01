import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

hook = """
  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderContent = () => {
"""

content = content.replace("  const renderContent = () => {", hook)

with open('src/App.tsx', 'w') as f:
    f.write(content)
