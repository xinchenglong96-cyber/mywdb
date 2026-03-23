import re
import base64

with open('/tmp/supa-raw.yml', 'r') as f:
    text = f.read()

# Remove the analytics block completely
text = re.sub(r'\n  analytics:.*?(?=\n  [a-z])', '', text, flags=re.DOTALL)
# Clean up dependencies
text = re.sub(r'\n {6}analytics:\n {8}condition: service_healthy', '', text)
text = re.sub(r'\n\s*-\s*analytics\b', '', text)

# Just to be sure, save it to disk for inspection
with open('docker-compose-patched-clean.yml', 'w') as f:
    f.write(text)

print(base64.b64encode(text.encode('utf-8')).decode('utf-8'))
