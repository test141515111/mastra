// Mastra UI Japanese localization script
document.addEventListener('DOMContentLoaded', function() {
  // Translation dictionary for UI elements
  const translations = {
    // Navigation and Headers
    'Mastra Playground': 'Mastra プレイグラウンド',
    'Agents': 'エージェント',
    'Chat': 'チャット',
    'Workflows': 'ワークフロー',
    'Documentation': 'ドキュメント',
    
    // Agent-related terms
    'Weather Agent': '天気エージェント',
    'Article Agent': '記事エージェント',
    'Image Generation Agent': '画像生成エージェント',
    
    // UI elements
    'Search': '検索',
    'Send': '送信',
    'Try it out': '試してみる',
    'Execute': '実行',
    'Clear': 'クリア',
    'Cancel': 'キャンセル',
    'Back': '戻る',
    'Next': '次へ',
    'Submit': '送信',
    'Loading...': '読み込み中...',
    'No results found': '結果が見つかりません',
    
    // Messages and notifications
    'An error occurred': 'エラーが発生しました',
    'Success': '成功',
    'Warning': '警告',
    'Info': '情報',
    
    // Input placeholders
    'Type your message here...': 'メッセージを入力してください...',
    'Enter a prompt': 'プロンプトを入力',
    
    // Other common terms
    'Settings': '設定',
    'Profile': 'プロフィール',
    'Logout': 'ログアウト',
    'Login': 'ログイン'
  };
  
  // Function to translate text content of elements
  function translateTextContent() {
    document.querySelectorAll('*').forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
        }
      }
    });
  }
  
  // Function to translate placeholders in input fields
  function translatePlaceholders() {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(element => {
      const placeholder = element.getAttribute('placeholder');
      if (translations[placeholder]) {
        element.setAttribute('placeholder', translations[placeholder]);
      }
    });
  }
  
  // Function to translate button texts
  function translateButtons() {
    document.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      if (translations[text]) {
        button.textContent = translations[text];
      }
    });
  }
  
  // Function to translate aria-labels
  function translateAriaLabels() {
    document.querySelectorAll('[aria-label]').forEach(element => {
      const label = element.getAttribute('aria-label');
      if (translations[label]) {
        element.setAttribute('aria-label', translations[label]);
      }
    });
  }
  
  // Set document language to Japanese
  document.documentElement.lang = 'ja';
  
  // Initial translation
  translateTextContent();
  translatePlaceholders();
  translateButtons();
  translateAriaLabels();
  
  // Use MutationObserver to handle dynamic content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        translateTextContent();
        translatePlaceholders();
        translateButtons();
        translateAriaLabels();
      }
    });
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
});
