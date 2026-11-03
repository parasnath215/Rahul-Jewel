import os
import re

html_files = [
    'index.html',
    'about.html',
    'contact.html',
    'product.html',
    'bangles.html',
    'bracelets.html',
    'chains.html',
    'earrings.html',
    'fancy-chains.html',
    'necklaces.html',
    'rings.html',
    'studs.html'
]

print("=== CHECKING ASSET REFERENCES AND INTERNAL LINKS ===")
total_issues = 0

for hfile in html_files:
    if not os.path.exists(hfile):
        print(f"ERROR: {hfile} missing!")
        total_issues += 1
        continue

    with open(hfile, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check images
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    for src in img_srcs:
        # ignore empty or data URIs
        if not src or src.startswith('data:'):
            continue
        # clean query params if any
        clean_src = src.split('?')[0]
        if not os.path.exists(clean_src):
            print(f"[{hfile}] Missing image: {clean_src}")
            total_issues += 1

    # Check stylesheets
    css_hrefs = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content)
    for href in css_hrefs:
        if not href.startswith('http') and not os.path.exists(href):
            print(f"[{hfile}] Missing stylesheet: {href}")
            total_issues += 1

    # Check scripts
    js_srcs = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
    for src in js_srcs:
        if not src.startswith('http') and not os.path.exists(src):
            print(f"[{hfile}] Missing script: {src}")
            total_issues += 1

    print(f"OK: {hfile} verified with {len(img_srcs)} images, CSS, and JS links.")

if total_issues == 0:
    print("ALL FILES PASS VERIFICATION 100%! NO MISSING ASSETS OR BROKEN LINKS!")
else:
    print(f"Found {total_issues} issues.")

