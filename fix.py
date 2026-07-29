import re

with open('templates/love/memories.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Separate modals from the main loop
loop_pattern = r'({% for memory in memories %})(.*?)({% endfor %})'
match = re.search(loop_pattern, html, flags=re.DOTALL)
if match:
    loop_content = match.group(2)
    # The modal starts at <!-- ── MODAL FOR FULL STORY ── -->
    modal_split = loop_content.split('<!-- ── MODAL FOR FULL STORY ── -->')
    card_html = modal_split[0]
    modal_html = '<!-- ── MODAL FOR FULL STORY ── -->' + modal_split[1]
    
    # Replace the white button with a new custom one in card_html
    card_html = re.sub(
        r'<button[^>]*class=[\'\"].*?btn-romantic-story.*?[\'\"][^>]*>.*?</button>',
        '<button type="button" class="custom-premium-btn" data-bs-toggle="modal" data-bs-target="#memoryModal{{ memory.id }}">\n                                    ❤️ Read Full Story →\n                                </button>',
        card_html,
        flags=re.DOTALL
    )

    # Adjust modal html for scrolling
    modal_html = modal_html.replace('modal-dialog-centered', 'modal-dialog-centered modal-dialog-scrollable custom-modal-dialog')
    modal_html = modal_html.replace('class="modal-content glass-strong memory-modal"', 'class="modal-content glass-strong memory-modal custom-modal-content"')
    modal_html = modal_html.replace('class="modal-body py-4 px-4 px-md-5"', 'class="modal-body custom-modal-body py-4 px-4 px-md-5"')
    
    # Reconstruct
    new_html = html[:match.start()] + '{% for memory in memories %}' + card_html + '{% endfor %}\n\n    <!-- MODALS LOOP -->\n    {% for memory in memories %}' + modal_html + '{% endfor %}' + html[match.end():]
    
    # Also update CSS hash cache busting
    new_html = re.sub(r'timeline_redesign_final_v2', 'timeline_redesign_final_v3', new_html)

    with open('templates/love/memories.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('HTML successfully updated.')
else:
    print('Could not find loop.')
