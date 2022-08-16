let color = '#3aa757';
let res; 

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  let bookmark = chrome.bookmarks.getTree(process_bookmark);
});


function process_bookmark(bookmarks) {

  for (var i =0; i < bookmarks.length; i++) {
      var bookmark = bookmarks[i];
      // console.log('len' + bookmarks.length);
      // console.log(bookmark.title);
      // console.log(bookmark.children);
      if (bookmark.title === "extension_hook") {
          var book = bookmark
          // console.log("fin");
          // console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
          res = bookmark.children;
          console.log(res);
      }

      if (bookmark.children) {
          process_bookmark(bookmark.children);
      }
  }
}

