#!/usr/bin/env python3
"""
bump-version.py —— 一键更新 index.html 里所有 ?v= 版本号

用法：
    python bump-version.py            # 用当前时间戳做版本号
    python bump-version.py 24         # 手动指定版本号
"""

import re
import sys
import time
from pathlib import Path

INDEX = Path(__file__).parent / 'index.html'

if not INDEX.exists():
    print(f'❌ 找不到 {INDEX}')
    sys.exit(1)

version = sys.argv[1] if len(sys.argv) > 1 else str(int(time.time()))

html = INDEX.read_text(encoding='utf-8')

pattern = re.compile(r'(\?v=)[^"\'&\s]+')
new_html, count = pattern.subn(rf'\g<1>{version}', html)

INDEX.write_text(new_html, encoding='utf-8')

print(f'✅ 已更新 {count} 处版本号 → v={version}')