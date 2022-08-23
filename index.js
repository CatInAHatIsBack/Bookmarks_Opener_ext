import {StorageKey, getstoreValue, saveAndPrint, saveAndPrintUrl, getMyOpt, setUi, updateTabCount} from "./Components/storage/storage.js";
import {getUiCheckBox, getUiprintButton, getUiFunctionButton, getUiInput, getUiTabCount}from "./Components/ui/ui.js"
import { checkForExisting, setHook} from "./Components/bookmarks/bookmarks.js"
import extractURLs from "./Components/extract/extract.js"
import {loadSites} from "./Components/load/load.js"


let showChange = false;
let printbuttons = true;
let onchangecheck = true;
let checkbox = true
let functionbutton = true;
const Save_UrlList_Debounce = 500;
const Update_TabCount_Debouce= 500;


let hook;

let inputVal
let functionButton
let tabCountInfo
let checkBox 

const init = (() => {
    // get hook on load
    chrome.bookmarks.getTree(getHook);

    tabCountInfo = getUiTabCount()
    console.log(tabCountInfo.tabCountNumber)
    inputVal = getUiInput()
    functionButton = getUiFunctionButton()
    checkBox = getUiCheckBox()
    setUi(inputVal, tabCountInfo, checkBox)
    if (showChange){
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
              console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
              );
            }
        });
    }
    
    
    // printing buttons 
    if (printbuttons){
        const printButtons = getUiprintButton()

        printButtons.printLazy.addEventListener("click", () => {
            getstoreValue(StorageKey.lazyLoad)
        });
        printButtons.printLocal.addEventListener("click", () => {
            getstoreValue(StorageKey.localStorage)
        });
        printButtons.printBookmark.addEventListener("click", () => {
            getstoreValue(StorageKey.bookmarksStorage)
        });
        printButtons.printPreserve.addEventListener("click", () => {
            getstoreValue(StorageKey.preserve)
        });
    }

    
    // onchange listener checkbox
    if (checkbox) {


        checkBox.lazyLoad.addEventListener("change", () => {
            let key = StorageKey.lazyLoad
            let string = "lazyLoad"
            let checked = lazyLoad.checked

            console.log(lazyLoad)
            saveAndPrint(key,string,checked) 
        });
        checkBox.localStorage.addEventListener("change", () => {
            let key = StorageKey.localStorage
            let string = "localStorage"
            let checked = checkBox.localStorage.checked 
            console.log(localStorage)

            saveAndPrint(key,string,checked) 
        });
        checkBox.bookmarksStorage.addEventListener("change", () => {
            let key = StorageKey.bookmarksStorage
            let string = "bookmarksStorage"
            let checked = bookmarksStorage.checked

            console.log(bookmarksStorage)
            saveAndPrint(key,string,checked) 
        });
        checkBox.preserve.addEventListener("change", () => {
            let key = StorageKey.preserve
            let string = "preserve"
            let checked = preserve.checked
            
            console.log(preserve)
            saveAndPrint(key,string,checked) 
        });
    }
    

    
    inputVal.txtArea.addEventListener("input", () => {
            debouncedSaveUrlList();
            debouncedUpdateTabCount();
        });
    if ( functionbutton ) {


    functionButton.open.addEventListener("click", () => {
        loadSites(inputVal.txtArea.value, lazyLoad.checked)  
    });
    functionButton.extract.addEventListener("click", () => {
        inputVal.txtArea.value = extractURLs(inputVal.txtArea.value);
        saveAndPrintUrl()
        updateTabCount()
    });
    functionButton.reload.addEventListener("click", () => {
        chrome.runtime.reload()
    });
    functionButton.restore.addEventListener("click", () => {
        getMyOpt()
    })
    functionButton.saveToBookmarks.addEventListener("click", () => {
      let val = projectName.value
      checkForExisting(val)
      console.log("projectName.value : " + val)
    });
    }
    
});

function getHook(book){
  let found = false;
  for (var i =0; i < book.length; i++) {
    if (found === false){
      var bookmark = book[i]
      // console.log("bookmark: " + book[i].title)
      // console.log("bookmark child: " + book[i].children)
      if (bookmark.title === "extension_hook") {
        found = true;
        // sethook(bookmark)
        hook = bookmark
        setHook(hook, inputVal)
        // console.log("hook: " + bookmark)
        // console.log("hooktitle: " + bookmark.title)
      }
      if(bookmark.children){
        getHook(bookmark.children)
      }
    }
  }
}


// *********************************************************//
// *********************************************************//



// *********************************************************//
// *********************************************************//





function debounceTab(func, timeout = Update_TabCount_Debouce) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }; 
}
function debounceSave(func, timeout = Save_UrlList_Debounce){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }


const debouncedUpdateTabCount = debounceTab(() => 
    updateTabCount()
);
const debouncedSaveUrlList = debounceSave(() => 
    saveAndPrintUrl()
  );


document.addEventListener('DOMContentLoaded', init);