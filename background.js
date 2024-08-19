chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['languages.js', 'functions.js', 'main.js', 'components.js']
    });
  });
  