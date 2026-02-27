// Code Block Interactions

document.addEventListener('DOMContentLoaded', () => {
  // Add copy functionality to all copy buttons
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block-container').querySelector('code');
      const text = codeBlock.textContent;

      try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.classList.add('copied');

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = '✗ Failed';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    });
  });
});
