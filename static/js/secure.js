document.addEventListener('DOMContentLoaded', () => {
  const MAX_INPUT_LENGTH = 150; // Limit for all input fields
  const blockedPatterns = [
    /<script.*?>.*?<\/script>/gi,        // Script tags
    /(['"]).*?\1\s*;/g,                  // Quoted string followed by semicolon (common in SQLi)
    /(--|#|\/\*|\*\/)/g,                 // SQL comment markers
    /\b(SELECT|INSERT|DELETE|DROP|UPDATE|ALTER|UNION|EXEC)\b/gi, // SQL keywords
    /on\w+=".*?"/gi                      // Inline event handlers (e.g., onclick="...")
  ];

  // Sanitize a single value
  function sanitize(value) {
    // Remove dangerous characters and trim input
    return value
      .replace(/[<>"'`;\\]/g, '') 
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Validate and sanitize all text inputs and textareas
  const fields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], textarea');

  fields.forEach(field => {
    field.setAttribute('maxlength', MAX_INPUT_LENGTH);
    
    field.addEventListener('input', () => {
      if (field.value.length > MAX_INPUT_LENGTH) {
        field.value = field.value.slice(0, MAX_INPUT_LENGTH);
      }

      for (const pattern of blockedPatterns) {
        if (pattern.test(field.value)) {
          field.value = '';
          alert('Potentially unsafe input detected. Please revise your entry.');
          break;
        }
      }

      field.value = sanitize(field.value);
    });
  });

  // Prevent submission of dangerous forms
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const allInputs = form.querySelectorAll('input, textarea');
      for (const input of allInputs) {
        for (const pattern of blockedPatterns) {
          if (pattern.test(input.value)) {
            e.preventDefault();
            alert(`Suspicious content in field "${input.name || 'unnamed'}". Submission blocked.`);
            return false;
          }
        }
      }
    });
  });
});
