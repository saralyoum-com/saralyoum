#!/usr/bin/env python3
"""Inline the subset fonts and logo into a template, producing a ready file.

Templates carry __FONT_BOLD__ / __FONT_XBOLD__ / __LOGO__ placeholders instead of
150KB of base64 so they stay readable and diffable in git. This script fills them.

    python3 build.py morning-post.template.html out.html
"""
import base64, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()

def build(tpl_path, out_path):
    s = open(tpl_path, encoding='utf-8').read()
    s = (s.replace('__FONT_BOLD__',  b64(os.path.join(HERE, 'fonts/tajawal-bold.woff2')))
          .replace('__FONT_XBOLD__', b64(os.path.join(HERE, 'fonts/tajawal-xbold.woff2')))
          .replace('__LOGO__',       b64(os.path.join(REPO, 'public/logo.png'))))
    for t in ('__FONT_BOLD__', '__FONT_XBOLD__', '__LOGO__'):
        assert t not in s, f'unfilled placeholder: {t}'
    open(out_path, 'w', encoding='utf-8').write(s)
    print(f'{out_path}  {len(s)//1024} KB')
    return s

if __name__ == '__main__':
    tpl = sys.argv[1] if len(sys.argv) > 1 else 'morning-post.template.html'
    out = sys.argv[2] if len(sys.argv) > 2 else tpl.replace('.template', '')
    build(tpl, out)
