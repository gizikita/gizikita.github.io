import os
sz = os.path.getsize('/home/lexciese/Dev/projects/status-gizi/GiziKita_Panduan_Operasional.pdf')
with open('/home/lexciese/Dev/projects/status-gizi/GiziKita_Panduan_Operasional.pdf','rb') as f:
    data = f.read()
pages = data.count(b'/Type /Page') - data.count(b'/Type /Pages')
print(f'Size: {sz} bytes ({sz/1024:.0f}K)')
print(f'Pages: {pages}')
print(f'Images: {data.count(b"/Subtype /Image")}')
print(f'PDF OK: {data.startswith(b"%PDF-")}')
print(f'Trailer: {data.rstrip()[-4:] == b"%%EOF"}')
