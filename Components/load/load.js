
const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;
export function loadSites(
    text ,
    lazyloading 
  ) {
    const urlschemes = ['http', 'https', 'file', 'view-source'];
    let urls = text.split(URL_LINE_SPLIT_REGEX);
  
    for (let i = 0; i < urls.length; i++) {
      let theurl = urls[i].trim();
      if (theurl !== '') {
        if (urlschemes.indexOf(theurl.split(':')[0]) === -1) {
          theurl = 'http://' + theurl;
        }
        if (
          lazyloading &&
          theurl.split(':')[0] !== 'view-source' &&
          theurl.split(':')[0] !== 'file'
        ) {
          chrome.tabs.create({
            url: chrome.runtime.getURL('/Components/load/lazyloading.html#') + theurl,
            active: false,
          });
        } else {
          chrome.tabs.create({
            url: theurl,
            active: false,
          });
        }
      }
    }
  }