#!/usr/bin/env python3
"""Screenshot a built template at its exact canvas size.

    python3 shoot.py morning-post.html out.png [width height]

Chrome's --window-size does not map 1:1 to the layout viewport in this
container, so a same-size capture clips the bottom of the canvas. Render
larger, then crop to the declared size.
"""
import subprocess, sys, os
from PIL import Image

CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

def shoot(src, out, w=1080, h=1080):
    src = os.path.abspath(src)
    raw = '/tmp/_falconeye_raw.png'
    subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-sandbox',
        '--hide-scrollbars', '--force-device-scale-factor=1',
        f'--window-size={w+40},{h+320}', f'--screenshot={raw}', f'file://{src}'],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    Image.open(raw).convert('RGB').crop((0, 0, w, h)).save(out)
    print(f'{out}  {Image.open(out).size[0]}x{Image.open(out).size[1]}')

if __name__ == '__main__':
    a = sys.argv[1:]
    shoot(a[0], a[1], int(a[2]) if len(a) > 2 else 1080, int(a[3]) if len(a) > 3 else 1080)
