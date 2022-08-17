import {storeValue, StorageKey, getstoreValue , getStoredOptions}from "./storage.js";

let lazyLoad = document.getElementById("lazyLoad");
let localStorage = document.getElementById("localStorage");
let bookmarksStorage = document.getElementById("bookmarksStorage");
let preserve = document.getElementById("preserve");

let printlazy = document.getElementById("printlazy");
let printlocal = document.getElementById("printlocal");
let printbookmark = document.getElementById("printbookmark");
let printpreserve = document.getElementById("printpreserve");

let reload = document.getElementById("reload");
let restore = document.getElementById("restore");

let txtArea = document.getElementById("urls")

let tabCountVis = document.getElementById('tabcount')
let tabCountTabLabel = document.getElementById('tabcount-tab-label')
let tabCountNumber = document.getElementById('tabcount-number')


let extract = document.getElementById('extract')
// const printlazykey = async () => {
//     getstoreValue(StorageKey.lazyload)
// }
// const printlocalkey = async () => {
//     await printlazykey()
//     getstoreValue(StorageKey.localStorage)
// }
// const printbookmarkskey = async () => {
//     await printlocalkey()
//     getstoreValue(StorageKey.bookmarksStorage)
// }
// const printpreservekey = async () => {
//     await printbookmarkskey()
//     getstoreValue(StorageKey.preserve)
    
// }
let showChange = false;
let printButtons = true;
let onchangecheck = true;

const Save_UrlList_Debounce = 500;
const Update_TabCount_Debouce= 500;

const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

const init = (() => {
        // async & callbacks
        // https://www.pluralsight.com/guides/javascript-callbacks-variable-scope-problem
        // new Promise(() => {
        //     let myOptions = getStoredOptions()
        // }).then(
        //     get
        // )
    restore.addEventListener("click", () => {
        getMyOpt()
        
    })
    extract.addEventListener("click", () => {
        txtArea.value = extractURLs(txtArea.value);
        saveAndPrintUrl()
        updateTabCount()
    });
    
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
    if (printButtons){
        printlazy.addEventListener("click", () => {
            getFromStore(StorageKey.lazyLoad)
        });
        printlocal.addEventListener("click", () => {
            getFromStore(StorageKey.localStorage)
        });
        printbookmark.addEventListener("click", () => {
            getFromStore(StorageKey.bookmarksStorage)
        });
        printpreserve.addEventListener("click", () => {
            getFromStore(StorageKey.preserve)
        });
    }

    // onchange listener checkbox
    if (onchangecheck) {

        txtArea.addEventListener("change", () => {
            let key = StorageKey.urlList
            let string = "txtArea"
            let value = txtArea.value

            debouncedSaveUrlList();
            debouncedUpdateTabCount();
            
            // debouncedUpdateTabCount(ui);
            // saveAndPrint(key,string,value)

        });
        lazyLoad.addEventListener("change", () => {
            let key = StorageKey.lazyLoad
            let string = "lazyLoad"
            let checked = lazyLoad.checked

            saveAndPrint(key,string,checked) 
        });
        localStorage.addEventListener("change", () => {
            let key = StorageKey.localStorage
            let string = "localStorage"
            let checked = localStorage.checked 

            saveAndPrint(key,string,checked) 
        });
        bookmarksStorage.addEventListener("change", () => {
            let key = StorageKey.bookmarksStorage
            let string = "bookmarksStorage"
            let checked = bookmarksStorage.checked

            saveAndPrint(key,string,checked) 
        });
        preserve.addEventListener("change", () => {
            let key = StorageKey.preserve
            let string = "preserve"
            let checked = preserve.checked

            saveAndPrint(key,string,checked) 
        });
        
    }
    reload.addEventListener("click", () => {
        chrome.runtime.reload()
    });

    
});


function extractURLs (text) {
    let urls = '';
    let urlmatcharr;
    const urlregex =
      /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/gi;
  
    while ((urlmatcharr = urlregex.exec(text)) !== null) {
      const match = urlmatcharr[0];
      urls += match + '\n';
    }
  
    return urls;
  }


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


function saveAndPrintUrl() {
    let key = StorageKey.urlList
    let string = "txtArea"
    let value = txtArea.value
    if(preserve.checked){
        saveAndPrint(key,string,value) 
    }

}
const updateTabCount = () => {
    let tabCount = '0';
    if (txtArea.value) {
      const lines = txtArea.value.split(URL_LINE_SPLIT_REGEX);
      if (lines.length <= 5000) {
        // limit for performance reasons
        tabCount = String(lines.filter((line) => line.trim() !== '').length);
      } else {
        tabCount = '> 5000';
      }
      console.log("changed line count")
    }
    tabCountVis = tabCount === '0' ? 'hidden' : 'visible'; 
    tabCountNumber.textContent = tabCount;
    tabCountTabLabel.textContent = tabCount === '1' ? 'tab' : 'tabs';
  };

const debouncedUpdateTabCount = debounceTab(() => 
    updateTabCount()
);
const debouncedSaveUrlList = debounceSave(() => 
    saveAndPrintUrl()
  );
function saveAndPrint(key,string,value){
        console.log(`Loaded ${string}`);
        console.log(`${string} is: ${value}`);
        storeValue(key, value)
        getstoreValue(key) 
        console.log("txt field was saved:")
    }
async function getFromStore(key) {
    const val = await getstoreValue(key)
    console.log("after get: "+val)
}


async function getMyOpt() {
        const myOptions = await getStoredOptions() 
        printOpt(myOptions) 
        setOpt(myOptions)
}
function setOpt(myOptions){
    txtArea.value = myOptions.txt
    lazyLoad.checked = myOptions.lazyload 
    localStorage.checked = myOptions.localstorage
    bookmarksStorage.checked = myOptions.bookmarksstorage
    preserve.checked = myOptions.preserve
}
function printOpt(myOptions) {
    console.log()
    console.log("Options are: ")
    const txt = myOptions.txt
    console.log("txt: "+ txt)
    const lazyLoad = myOptions.lazyload
    console.log("lazyLoad: "+ lazyLoad)
    const localStorage = myOptions.localstorage  
    console.log("localStorage: "+ localStorage)
    const bookmarksStorage = myOptions.bookmarksstorage
    console.log("bookmarksStorage: "+ bookmarksStorage)
    const preserve = myOptions.preserve
    console.log("val of preserve is: " + preserve)
    console.log("preserve: "+ preserve)
}
    
  
  

// window.addEventListener('load', (event) => {
//     console.log('page is fully loaded');
//   });
// window.onload = ((event) =>  {
//     var checkbox = document.getElementById("lazyLoad"); 
//     console.log("pf")
//     checkbox.addEventListener('change', function() {
//       if (this.checked) {
//         console.log("Checkbox is checked..");
//       } else {
//         console.log("Checkbox is not checked..");
//       }
//     }); 
//     console.log("fin")

// }
// );

document.addEventListener('DOMContentLoaded', init);