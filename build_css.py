from css1 import css as c1
from css2 import css as c2
with open('static/css/memories.css', 'w', encoding='utf-8') as out:
    out.write(c1 + c2)