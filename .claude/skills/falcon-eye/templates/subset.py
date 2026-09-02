import re, subprocess, os
# Every character the design actually sets in type. Subsetting to these keeps the
# Arabic shaping tables for the retained glyphs while dropping the ~95% of the
# face the design never uses.
tpl = open('template.html', encoding='utf-8').read()
body = tpl.split('</style>',1)[1]
text = re.sub(r'<[^>]+>', ' ', body)
text = text.replace('&#9650;','▲').replace('&#9660;','▼')
chars = set(text) - set(' \n\t')
chars |= set('0123456789.,%$@·▲▼-–—:/')
chars |= set('abcdefghijklmnopqrstuvwxyz')
uni = ','.join('U+%04X' % ord(c) for c in sorted(chars))
print('glyphs kept:', len(chars))

os.makedirs('fonts', exist_ok=True)
for src, out in [('Tajawal-Bold','tajawal-bold'), ('Tajawal-ExtraBold','tajawal-xbold')]:
    subprocess.run(['pyftsubset', f'/home/user/saralyoum/public/fonts/{src}.ttf',
        f'--unicodes={uni}', "--layout-features=*", '--flavor=woff2',
        f'--output-file=fonts/{out}.woff2'], check=True)
    a = os.path.getsize(f'/home/user/saralyoum/public/fonts/{src}.ttf')
    b = os.path.getsize(f'fonts/{out}.woff2')
    print(f'{src}: {a//1024}KB -> {b//1024}KB woff2')
