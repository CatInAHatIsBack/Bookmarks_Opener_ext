function init() {
    document.title =
      '[' +
      window.location.hash
        .substring(1)
        .replace('http://', '')
        .replace('https://', '') +
      ']';
    // load site on focus
    window.addEventListener(
      'focus',
      () => {
        window.location.replace(window.location.hash.substring(1));
      },
      false
    );
  }
  init();
  