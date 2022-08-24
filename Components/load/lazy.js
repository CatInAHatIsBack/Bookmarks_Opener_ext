function init() {
    // console.log("document title: "+document.title)
    document.title =
      '[' +
      window.location.hash
        .substring(1)
        .replace('http://', '')
        .replace('https://', '') +
      ']';
    // console.log("document title: "+document.title)
  // console.log("window hash: " + window.location.hash)
    // load site on focus
    window.addEventListener(
      'focus',
      () => {
        // console.log("load: "+ window.location.hash)
        window.location.replace(window.location.hash.substring(1));
      },
      false
    );
  }
  init();
  