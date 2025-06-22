const isProUser = true;

const toggleBtnDiv = document.getElementById('toggleEditorBtn');
const toggleBtn = toggleBtnDiv.querySelector('button');
const quillEditor = document.getElementById('quill-wrapper');
const grapesjsEditor = document.getElementById('grapesjsEditor');
const proTag = document.getElementById('pro');

let editor;

function initGrapesJSEditor() {
  if (editor) return; // Prevent double init

  editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      storageManager: false,
      fromElement: false,
      plugins: [
        'grapesjs-preset-newsletter',
        'grapesjs-blocks-basic-extend'
      ],
      pluginsOpts: {
        'grapesjs-preset-newsletter': {},
        'grapesjs-blocks-basic-extend': {}
      },
      blockManager: {
        appendTo: '#blocks',
      }
    });

    editor.on('load', () => {
      const bm = editor.BlockManager;


      bm.add('text-muted', {
  label: 'Muted Text',
  category: 'Text',
  attributes: { class: 'fa fa-low-vision' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:14px; color:#999; font-family: Arial, sans-serif;">
      Muted or secondary text.
    </td>
  </tr></table>`
});

              bm.add('layout-2-col', {
        label: '2 Columns',
        category: 'Layout',
        attributes: { class: 'fa fa-columns' },
        content: `
          <table style="width:100%;"><tr>
            <td style="width:50%; padding:10px;">Column 1</td>
            <td style="width:50%; padding:10px;">Column 2</td>
          </tr></table>
        `
      });

      bm.add('layout-3-col', {
        label: '3 Columns',
        category: 'Layout',
        attributes: { class: 'fa fa-table' },
        content: `
          <table style="width:100%;"><tr>
            <td style="width:33%; padding:10px;">Col 1</td>
            <td style="width:33%; padding:10px;">Col 2</td>
            <td style="width:33%; padding:10px;">Col 3</td>
          </tr></table>
        `
      });



bm.add('layout-header', {
  label: 'Header',
  category: 'Layout',
  attributes: { class: 'fa fa-heading' },
  content: `
    <table style="width:100%; background:#eee;">
      <tr>
        <td style="padding:20px; text-align:center; font-size:24px;">
          <div data-gjs-editable="true">Header Title</div>
        </td>
      </tr>
    </table>
  `
});

bm.add('layout-footer', {
  label: 'Footer',
  category: 'Layout',
  attributes: { class: 'fa fa-shoe-prints' },
  content: `
    <table style="width:100%; background:#f2f2f2;">
      <tr>
        <td style="padding:20px; text-align:center; font-size:14px;">
          <div data-gjs-editable="true">Footer Text</div>
        </td>
      </tr>
    </table>
  `
});


      bm.add('layout-spacer-10', {
  label: 'Spacer 10px',
  category: 'Layout',
  attributes: { class: 'fa fa-arrows-alt-v' },
  content: `<table style="width:100%;"><tr><td style="height:10px; line-height:10px;">&nbsp;</td></tr></table>`
});

bm.add('layout-spacer-20', {
  label: 'Spacer 20px',
  category: 'Layout',
  attributes: { class: 'fa fa-arrows-alt-v' },
  content: `<table style="width:100%;"><tr><td style="height:20px; line-height:20px;">&nbsp;</td></tr></table>`
});

bm.add('layout-spacer-40', {
  label: 'Spacer 40px',
  category: 'Layout',
  attributes: { class: 'fa fa-arrows-alt-v' },
  content: `<table style="width:100%;"><tr><td style="height:40px; line-height:40px;">&nbsp;</td></tr></table>`
});

bm.add('layout-divider-thin', {
  label: 'Thin Divider',
  category: 'Layout',
  attributes: { class: 'fa fa-minus' },
  content: `<table style="width:100%;"><tr><td style="border-bottom:1px solid #ccc; padding:10px 0;">&nbsp;</td></tr></table>`
});

bm.add('layout-divider-thick', {
  label: 'Thick Divider',
  category: 'Layout',
  attributes: { class: 'fa fa-minus' },
  content: `<table style="width:100%;"><tr><td style="border-bottom:3px solid #999; padding:10px 0;">&nbsp;</td></tr></table>`
});

bm.add('layout-divider-dotted', {
  label: 'Dotted Divider',
  category: 'Layout',
  attributes: { class: 'fa fa-ellipsis-h' },
  content: `<table style="width:100%;"><tr><td style="border-bottom:1px dotted #bbb; padding:10px 0;">&nbsp;</td></tr></table>`
});

bm.add('layout-1-col', {
  label: '1 Column',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:100%;"><tr><td style="padding:15px;">Content here</td></tr></table>`
});

bm.add('layout-2-col-30-70', {
  label: '2 Columns 30/70',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:100%;"><tr>
              <td style="width:30%; padding:10px;">Col 1 (30%)</td>
              <td style="width:70%; padding:10px;">Col 2 (70%)</td>
            </tr></table>`
});

bm.add('layout-2-col-70-30', {
  label: '2 Columns 70/30',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:100%;"><tr>
              <td style="width:70%; padding:10px;">Col 1 (70%)</td>
              <td style="width:30%; padding:10px;">Col 2 (30%)</td>
            </tr></table>`
});

bm.add('layout-3-col-25-50-25', {
  label: '3 Columns 25/50/25',
  category: 'Layout',
  attributes: { class: 'fa fa-table' },
  content: `<table style="width:100%;"><tr>
              <td style="width:25%; padding:10px;">Col 1</td>
              <td style="width:50%; padding:10px;">Col 2</td>
              <td style="width:25%; padding:10px;">Col 3</td>
            </tr></table>`
});

bm.add('layout-3-col-20-60-20', {
  label: '3 Columns 20/60/20',
  category: 'Layout',
  attributes: { class: 'fa fa-table' },
  content: `<table style="width:100%;"><tr>
              <td style="width:20%; padding:10px;">Col 1</td>
              <td style="width:60%; padding:10px;">Col 2</td>
              <td style="width:20%; padding:10px;">Col 3</td>
            </tr></table>`
});

bm.add('layout-4-col-equal', {
  label: '4 Columns Equal',
  category: 'Layout',
  attributes: { class: 'fa fa-th-large' },
  content: `<table style="width:100%;"><tr>
              <td style="width:25%; padding:10px;">Col 1</td>
              <td style="width:25%; padding:10px;">Col 2</td>
              <td style="width:25%; padding:10px;">Col 3</td>
              <td style="width:25%; padding:10px;">Col 4</td>
            </tr></table>`
});

bm.add('layout-section-wrapper', {
  label: 'Section Wrapper',
  category: 'Layout',
  attributes: { class: 'fa fa-square' },
  content: `<table style="width:100%; background:#f7f7f7; border:1px solid #ddd;">
              <tr><td style="padding:20px;">
                <table style="width:100%;"><tr><td>Nested content here</td></tr></table>
              </td></tr>
            </table>`
});

bm.add('layout-2-row-2-col', {
  label: '2 Rows 2 Columns',
  category: 'Layout',
  attributes: { class: 'fa fa-th-list' },
  content: `<table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">Row 1, Col 1</td>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">Row 1, Col 2</td>
              </tr>
              <tr>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">Row 2, Col 1</td>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">Row 2, Col 2</td>
              </tr>
            </table>`
});

bm.add('layout-3-row-1-col', {
  label: '3 Rows 1 Column',
  category: 'Layout',
  attributes: { class: 'fa fa-list-alt' },
  content: `<table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:10px; border:1px solid #ddd;">Row 1</td></tr>
              <tr><td style="padding:10px; border:1px solid #ddd;">Row 2</td></tr>
              <tr><td style="padding:10px; border:1px solid #ddd;">Row 3</td></tr>
            </table>`
});

bm.add('layout-nested-cols', {
  label: 'Nested Columns',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">
                  <table style="width:100%;"><tr>
                    <td style="width:50%; padding:5px;">Nested 1</td>
                    <td style="width:50%; padding:5px;">Nested 2</td>
                  </tr></table>
                </td>
                <td style="width:50%; padding:10px; border:1px solid #ddd;">Col 2</td>
              </tr>
            </table>`
});

bm.add('layout-offset-col', {
  label: 'Offset Column',
  category: 'Layout',
  attributes: { class: 'fa fa-indent' },
  content: `<table style="width:100%;"><tr>
              <td style="width:20%;">&nbsp;</td>
              <td style="width:80%; padding:10px;">Offset content</td>
            </tr></table>`
});

bm.add('layout-centered-narrow', {
  label: 'Centered Narrow Column',
  category: 'Layout',
  attributes: { class: 'fa fa-align-center' },
  content: `<table style="width:100%;"><tr>
              <td style="width:15%;"></td>
              <td style="width:70%; padding:10px; background:#eee;">Centered Content</td>
              <td style="width:15%;"></td>
            </tr></table>`
});

bm.add('layout-2-col-fixed', {
  label: '2 Columns Fixed 200/400px',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:600px; max-width:100%;"><tr>
              <td style="width:200px; padding:10px;">Fixed 200px</td>
              <td style="width:400px; padding:10px;">Fixed 400px</td>
            </tr></table>`
});

bm.add('layout-3-col-fixed', {
  label: '3 Columns Fixed 150px',
  category: 'Layout',
  attributes: { class: 'fa fa-columns' },
  content: `<table style="width:450px; max-width:100%;"><tr>
              <td style="width:150px; padding:10px;">150px</td>
              <td style="width:150px; padding:10px;">150px</td>
              <td style="width:150px; padding:10px;">150px</td>
            </tr></table>`
});

bm.add('layout-full-width-padding', {
  label: 'Full Width + Padding',
  category: 'Layout',
  attributes: { class: 'fa fa-square' },
  content: `<table style="width:100%;"><tr>
              <td style="padding:30px;">Content with padding</td>
            </tr></table>`
});

bm.add('layout-bg-container', {
  label: 'Background Container',
  category: 'Layout',
  attributes: { class: 'fa fa-fill-drip' },
  content: `<table style="width:100%; background:#f0f0f0;"><tr>
              <td style="padding:20px;">Content inside colored container</td>
            </tr></table>`
});

bm.add('layout-highlight-col', {
  label: 'Highlight Column',
  category: 'Layout',
  attributes: { class: 'fa fa-paint-brush' },
  content: `<table style="width:100%;"><tr>
              <td style="width:50%; padding:10px; background:#ffebcc;"><div>Highlighted col</div></td>
              <td style="width:50%; padding:10px;"><div>Normal col</div></td>
            </tr></table>`
});

bm.add('text-header-large', {
  label: 'Header Large',
  category: 'Text',
  attributes: { class: 'fa fa-header' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:15px; font-size:28px; font-weight:bold; text-align:center; font-family: Arial, sans-serif;">
      <div>Large Header Text</div>
    </td>
  </tr></table>`
});

bm.add('text-header-medium', {
  label: 'Header Medium',
  category: 'Text',
  attributes: { class: 'fa fa-header' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:12px; font-size:22px; font-weight:bold; text-align:left; font-family: Arial, sans-serif;">
      <div>Medium Header Text</div>
    </td>
  </tr></table>`
});

bm.add('text-paragraph', {
  label: 'Paragraph',
  category: 'Text',
  attributes: { class: 'fa fa-paragraph' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; line-height:1.5; font-family: Arial, sans-serif; color:#333;">
      <div>This is a sample paragraph. You can replace this text with your content.</div>
    </td>
  </tr></table>`
});

bm.add('text-small', {
  label: 'Small Text',
  category: 'Text',
  attributes: { class: 'fa fa-font' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:8px; font-size:12px; line-height:1.4; font-family: Arial, sans-serif; color:#666;">
      <div>Small text for disclaimers or footnotes.</div>
    </td>
  </tr></table>`
});

bm.add('text-center', {
  label: 'Centered Text',
  category: 'Text',
  attributes: { class: 'fa fa-align-center' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; text-align:center; font-family: Arial, sans-serif; color:#333;">
      <div>Centered text block</div>
    </td>
  </tr></table>`
});

bm.add('text-right', {
  label: 'Right Aligned Text',
  category: 'Text',
  attributes: { class: 'fa fa-align-right' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; text-align:right; font-family: Arial, sans-serif; color:#333;">
      <div>Right aligned text block</div>
    </td>
  </tr></table>`
});

bm.add('text-bold', {
  label: 'Bold Text',
  category: 'Text',
  attributes: { class: 'fa fa-bold' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; font-weight:bold; font-family: Arial, sans-serif;">
      <div>Bold emphasized text.</div>
    </td>
  </tr></table>`
});

bm.add('text-italic', {
  label: 'Italic Text',
  category: 'Text',
  attributes: { class: 'fa fa-italic' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; font-style:italic; font-family: Arial, sans-serif;">
      <div>Italic styled text.</div>
    </td>
  </tr></table>`
});

bm.add('text-link', {
  label: 'Text Link',
  category: 'Text',
  attributes: { class: 'fa fa-link' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; font-family: Arial, sans-serif;">
      <div>Visit our <a href="#" style="color:#1a73e8; text-decoration:none;">website</a> for more info.</div>
    </td>
  </tr></table>`
});

bm.add('text-quote', {
  label: 'Blockquote',
  category: 'Text',
  attributes: { class: 'fa fa-quote-right' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:15px; font-size:16px; font-family: Arial, sans-serif; color:#666; border-left:4px solid #ccc; margin:0 10px;">
      <div>“This is a quoted text block with a left border.”</div>
    </td>
  </tr></table>`
});

bm.add('text-highlight', {
  label: 'Highlighted Text',
  category: 'Text',
  attributes: { class: 'fa fa-paint-brush' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:16px; background:#fffae6; font-family: Arial, sans-serif;">
      <div>Highlighted text for emphasis.</div>
    </td>
  </tr></table>`
});

bm.add('text-uppercase', {
  label: 'Uppercase Text',
  category: 'Text',
  attributes: { class: 'fa fa-text-height' },
  content: `<table style="width:100%;"><tr>
    <td style="padding:10px; font-size:14px; text-transform: uppercase; font-family: Arial, sans-serif; color:#444;">
      <div>Uppercase text block</div>
    </td>
  </tr></table>`
});





      // Remove default fullscreen and replace with custom fullscreen
      const panel = editor.Panels;
      panel.removeButton('options', 'fullscreen');
      panel.removeButton('options', 'export-template'); // "View Code" button
      panel.removeButton('options', 'save'); 
      panel.removeButton('options', 'import');

panel.addButton('options', {
  id: 'custom-fullscreen',
  className: 'fa fa-arrows-alt', // matches GrapesJS icons
  command: 'custom-fullscreen',
  attributes: { title: 'Fullscreen' },
  togglable: true, // this makes it act like a toggle
  active: false    // default inactive
});


      editor.Commands.add('custom-fullscreen', {
        run() {
          const wrapper = document.getElementById('editor-wrapper');
          if (!document.fullscreenElement) {
            wrapper.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }
      });

      // Optional: Hide GrapesJS "+" add blocks button
      const hideOpenBlocksBtn = () => {
        const buttons = document.querySelectorAll('.gjs-pn-buttons .gjs-pn-btn svg path');
        buttons.forEach(path => {
          if (path.getAttribute('d') === 'M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z') {
            const btn = path.closest('.gjs-pn-btn');
            if (btn) btn.style.display = 'none';
          }
        });
      };

      setTimeout(hideOpenBlocksBtn, 500);
    });

    // Refresh layout when fullscreen toggles
    document.addEventListener('fullscreenchange', () => {
      setTimeout(() => {
        editor.refresh();
        editor.refreshCanvas();
      }, 100);
    });
  }



let is_quill = true;
document.addEventListener('DOMContentLoaded', () => {
  if (isProUser) {
    toggleBtn.classList.remove('hidden');

    toggleBtn.addEventListener('click', () => {
      Toggle_quill()
    });
   

    // Init on load if default is Pro
    initGrapesJSEditor();
  } else {
    toggleBtnDiv.style.display = 'none';
    proTag.classList.add('hidden');
  }





});



// Get the HTML content from GrapesJS
function getEmailHtml() {
  if (!editor) {
    console.warn('Editor not initialized');
    return '';
  }
  return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
}



// Load HTML content into GrapesJS
function setEmailHtml(html) {
  if (!editor) {
    console.warn('Editor not initialized');
    return;
  }
  editor.setComponents('');
  editor.setStyle('');
  editor.setComponents(html);
}

const template_section = document.getElementById('template_section');

//true for quill , false for graoe js
function Toggle_quill(bool = null) {
  let grapesVisible;
    if (bool === null ) {
      grapesVisible = !grapesjsEditor.classList.contains('hidden');
    }
    else {
      grapesVisible = bool;
    }

      if (grapesVisible) {
        is_quill = true;
        // Switch to Quill
        template_section.classList.add('hidden');
        grapesjsEditor.classList.add('hidden');
        quillEditor.classList.remove('hidden');
        proTag.classList.add('hidden');
        toggleBtn.innerHTML = `
          Use PRO Editor
          <span class="ml-3 inline-block bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-widest select-none">
            PRO
          </span>
        `;
        toggleBtn.classList.remove('bg-gray-800');
        toggleBtn.classList.add('bg-gradient-to-r', 'from-purple-700', 'via-pink-600', 'to-red-500');
        toggleBtn.setAttribute('aria-pressed', 'false');
      } else {
        // Switch to GrapesJS
        template_section.classList.remove('hidden');
        is_quill = false;
        grapesjsEditor.classList.remove('hidden');
        quillEditor.classList.add('hidden');
        proTag.classList.remove('hidden');

        // Init GrapesJS only once
        setTimeout(() => initGrapesJSEditor(), 50);

        toggleBtn.innerHTML = `
          Use Basic Editor
          <span class="ml-3 inline-block bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-widest select-none">
            BASIC
          </span>
        `;
        toggleBtn.classList.remove('bg-gradient-to-r', 'from-purple-700', 'via-pink-600', 'to-red-500');
        toggleBtn.classList.add('bg-gray-800');
        toggleBtn.setAttribute('aria-pressed', 'true');
      }
}






setTimeout(() => {
    templates.forEach(tpl => {
  appendCardToGrid(tpl.id, tpl.title, tpl.image);
  }, 1000);
})

//template code here 

function appendCardToGrid(template_id, title, imageUrl) {
  const grid = document.getElementById('email_template_list');
  if (!grid) return;

  const card = document.createElement('div');
  card.className = `
    group bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 
    hover:shadow-pink-500/40 hover:ring-1 hover:ring-pink-500 
    transition-all duration-300 cursor-pointer
  `.trim();

  card.addEventListener('click', () => apply_template(template_id));

  card.innerHTML = `
    <div class="h-40 bg-gray-700 overflow-hidden">
      ${imageUrl 
        ? `<img src="${imageUrl}" alt="${title}" class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105">`
        : `<div class="flex items-center justify-center h-full text-gray-500 italic">No Preview</div>`
      }
    </div>
    <div class="p-4 space-y-1">
      <h4 class="text-white font-semibold text-sm truncate">${title || 'Untitled Template'}</h4>
      <button class="mt-8 w-full bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs py-2 px-4 rounded-lg transition">
        Use Template
      </button>
    </div>
  `;

  grid.appendChild(card);
}



// Sample list of templates (adjust these as needed)
const templates = [
  { id: 'first', title: 'Professional', image: '/static/img/email_templates/first.png' },
  { id: 'second', title: 'Dark', image: '/static/img/email_templates/second.png' },
];



// Example loop to add them


// Handle applying template content
function apply_template(id) {
  const contentMap = {
      'first': `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:auto; font-family: Arial, sans-serif; background:#ffffff; border:1px solid #ddd;">
  <!-- Header -->
  <tr>
    <td style="background:#003366; padding:30px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:28px;">Quarterly Business Review</h1>
      <p style="margin:5px 0 0; font-size:14px; opacity:0.8;">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
    </td>
  </tr>

  <!-- Hero Image -->
  <tr>
    <td style="padding:20px;">
      <img src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" alt="Business Meeting" style="width:100%; border-radius:8px; display:block;">
    </td>
  </tr>

  <!-- Intro Text -->
  <tr>
    <td style="padding:20px; color:#333; font-size:16px; line-height:1.5;">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula, justo at feugiat pretium, odio eros vehicula elit, non condimentum lorem enim at nibh.</p>
      <p>Donec dapibus sapien nec purus suscipit, at malesuada arcu fermentum. Proin eu facilisis lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>
    </td>
  </tr>

  <!-- Section 1 -->
  <tr>
    <td style="padding:20px; border-top:1px solid #eee;">
      <h2 style="color:#003366; font-size:22px; margin-bottom:10px;">Key Achievements</h2>
      <ul style="color:#555; font-size:15px; line-height:1.4;">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Praesent convallis lacus vitae turpis consequat, id pulvinar orci vehicula.</li>
        <li>Phasellus non sapien et mauris congue sollicitudin.</li>
      </ul>
    </td>
  </tr>

  <!-- Section 2 -->
  <tr>
    <td style="padding:20px; border-top:1px solid #eee; background:#f9fafb;">
      <h2 style="color:#003366; font-size:22px; margin-bottom:10px;">Upcoming Initiatives</h2>
      <p style="color:#555; font-size:15px; line-height:1.5;">
        Curabitur faucibus leo a cursus consequat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </p>
      <a href="#" style="display:inline-block; margin-top:15px; padding:12px 24px; background:#0077cc; color:#fff; border-radius:5px; text-decoration:none; font-weight:bold;">Learn More</a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#003366; color:#bbb; font-size:12px; padding:15px; text-align:center;">
      <p style="margin:0;">© 2025 Company Name. All rights reserved.</p>
      <p style="margin:5px 0 0;">123 Business Rd, Suite 100, City, Country</p>
      <a href="#" style="color:#66b2ff; text-decoration:none;">Unsubscribe</a>
    </td>
  </tr>
</table>






    `,
    'second': `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background:#ffffff; border:1px solid #ddd;">
  <!-- Header -->
  <tr>
    <td style="background:#222222; padding:30px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:26px;">Introducing FlexDesk Pro</h1>
      <p style="font-size:16px; opacity:0.7; margin-top:5px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </td>
  </tr>

  <!-- Hero Image -->
  <tr>
    <td style="padding:20px;">
      <img src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" alt="Modern Office Desk" style="width:100%; border-radius:8px; display:block;">
    </td>
  </tr>

  <!-- Features -->
  <tr>
    <td style="padding:20px; color:#333; font-size:16px; line-height:1.5;">
      <h2 style="margin-top:0; font-size:20px; color:#111;">Why You’ll Love It</h2>
      <ul style="margin:0; padding-left:20px; color:#555; font-size:15px; line-height:1.4;">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Phasellus a elit eu nulla luctus placerat.</li>
        <li>Donec scelerisque arcu vel sapien fermentum, nec blandit est dapibus.</li>
        <li>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.</li>
      </ul>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:20px; text-align:center;">
      <a href="#" style="background:#007bff; color:white; padding:15px 30px; text-decoration:none; font-weight:bold; border-radius:6px; font-size:16px;">Shop Now</a>
    </td>
  </tr>

  <!-- Testimonial -->
  <tr>
    <td style="padding:20px; background:#f0f0f0; border-top:1px solid #ddd;">
      <blockquote style="font-style: italic; color: #666; margin:0;">
        “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel velit at libero suscipit efficitur.”
      </blockquote>
      <p style="margin-top:10px; font-weight: bold; font-size:14px; color:#333;">— Alex Johnson, Freelancer</p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#222222; color:#aaa; font-size:12px; padding:15px; text-align:center;">
      <p style="margin:0;">© 2025 FlexDesk Co. All rights reserved.</p>
      <p style="margin:5px 0 0;">123 Workspace Blvd, Office 7, City, Country</p>
      <a href="#" style="color:#66b2ff; text-decoration:none;">Unsubscribe</a>
    </td>
  </tr>
</table>

    `
  };
  

  const html = contentMap[id];
  if (!html) return;

  setEmailHtml(html);
}


