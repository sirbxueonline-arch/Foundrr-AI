export const visualEditorScript = `
  <script>
    (function() {
      let isEditing = false;
      let activeElement = null;

      window.addEventListener('message', (event) => {
        if (event.data.type === 'TOGGLE_EDIT_MODE') {
          isEditing = event.data.enabled;
          document.body.contentEditable = isEditing;
          
          if (isEditing) {
            document.body.classList.add('visual-editor-active');
            // Disable links while editing
            document.querySelectorAll('a').forEach(a => {
                a.style.pointerEvents = 'none';
                a.dataset.href = a.href;
                a.removeAttribute('href');
            });
            // Add hover effect style
            const style = document.createElement('style');
            style.id = 'editor-styles';
            style.textContent = \`
              .visual-editor-active [contenteditable]:hover {
                outline: 2px dashed #3b82f6; // blue-500
                cursor: text;
              }
              .visual-editor-active [contenteditable]:focus {
                outline: 2px solid #3b82f6;
                background-color: rgba(59, 130, 246, 0.05);
              }
            \`;
            document.head.appendChild(style);
          } else {
            document.body.classList.remove('visual-editor-active');
            // Re-enable links
            document.querySelectorAll('a').forEach(a => {
                a.style.pointerEvents = 'auto';
                if (a.dataset.href) a.href = a.dataset.href;
            });
            const style = document.getElementById('editor-styles');
            if (style) style.remove();
          }
        }
        
        if (event.data.type === 'GET_HTML') {
           // Clean up editor artifacts before sending back
           const clone = document.documentElement.cloneNode(true);
           clone.querySelectorAll('*').forEach(el => {
             el.removeAttribute('contenteditable');
             el.classList.remove('visual-editor-active');
             if (el.style.length === 0) el.removeAttribute('style');
             if (el.tagName === 'A' && el.dataset.href) {
                el.href = el.dataset.href;
                el.removeAttribute('data-href');
             }
           });
           const style = clone.querySelector('#editor-styles');
           if (style) style.remove();
           
           window.parent.postMessage({
             type: 'SAVE_HTML',
             html: clone.outerHTML
           }, '*');
        }
      });
      
      // Auto-resize logic for images could go here in v2
      
    })();
  </script>
`;
