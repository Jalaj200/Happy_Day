css_append = """
/* ──────────────────────────────────────────────
   10. FIXES: Custom Premium Button & Modal Scroll
   ────────────────────────────────────────────── */

.custom-premium-btn {
    -webkit-appearance: none;
    appearance: none;
    display: inline-block;
    padding: 0.85rem 2.2rem;
    font-size: 0.98rem;
    font-weight: 600;
    color: #ffffff !important;
    text-decoration: none;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    background: linear-gradient(135deg, #ff80ab 0%, #ff4081 50%, #e91e63 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    cursor: pointer;
    outline: none;
    position: relative;
    overflow: hidden;
}

.custom-premium-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3);
}

.custom-premium-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out;
}

.custom-premium-btn:active::after {
    width: 300px;
    height: 300px;
    opacity: 1;
    transition: 0s;
}

.custom-modal-content {
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.custom-modal-body {
    overflow-y: auto;
}
"""

with open('static/css/memories.css', 'a', encoding='utf-8') as f:
    f.write(css_append)

print("CSS appended successfully.")
