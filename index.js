import {StorageKey, getstoreValue, saveAndPrint, getMyOpt, setUi, updateTabCount} from "./Components/storage/storage.js";
import {getUiCheckBox, getUiprintButton, getUiFunctionButton, getUiInput, getUiTabCount}from "./Components/ui/ui.js"
import { checkForExisting, setHook} from "./Components/bookmarks/bookmarks.js"
import extractURLs from "./Components/extract/extract.js"
import {loadSites} from "./Components/load/load.js"


let showChange = false;
let printbuttons = true;
let checkbox = true
let functionbutton = true;

const Save_UrlList_Debounce = 250;
const Update_TabCount_Debouce= 250;


let hook;

let inputVal
let functionButton
let tabCountInfo
let checkBox 

const init = (() => {
    // get hook on load
    chrome.bookmarks.getTree(getHook);

    tabCountInfo = getUiTabCount()
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
        printButtons.printPreserve.addEventListener("click", () => {
            getstoreValue(StorageKey.preserve)
        });
    }

    
    // onchange listener checkbox
    if (checkbox) {

        checkBox.lazyLoad.addEventListener("change", () => {
            let string = "lazyLoad"

            saveAndPrint(string) 
        });
        
        checkBox.preserve.addEventListener("change", () => {
            let string = "preserve"
            
            saveAndPrint(string) 
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
    
    functionButton.saveToBookmarks.addEventListener("click", () => {
      let val = projectName.value
      checkForExisting(val)
    });
    }
    functionButton.reload.addEventListener("click", () => {
        chrome.runtime.reload()
    });
    functionButton.restore.addEventListener("click", () => {
        getMyOpt()
    })
    
});

function getHook(book){
  let found = false;
  for (var i =0; i < book.length; i++) {
    if (found === false){
      var bookmark = book[i]
      if (bookmark.title === "extension_hook") {
        found = true;
        // sethook(bookmark)
        hook = bookmark
        setHook(hook, inputVal)
      }
      if(bookmark.children){
        getHook(bookmark.children)
      }
    }
  }
}


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
    saveAndPrint("txtArea")
  );


document.addEventListener('DOMContentLoaded', init);