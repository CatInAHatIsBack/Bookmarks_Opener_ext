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
let open = document.getElementById('open')
let ext = document.getElementById('ext')

let projectName = document.getElementById('projectName') 
let saveToBookmarks = document.getElementById('saveToBookmarks') 

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

let hook;

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

        txtArea.addEventListener("input", () => {
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

    open.addEventListener("click", () => {
        loadSites(txtArea.value, lazyLoad.checked)  
    });
    
    // get hook on load
    chrome.bookmarks.getTree(getHook);

    ext.addEventListener("click", () => {
      console.log("myBookMark: " + hook)
      console.log("myBookMarktitle: " + hook.title)
    });
    saveToBookmarks.addEventListener("click", () => {
      let val = projectName.value
      checkForExisting(val)
      console.log("projectName.value : " + val)
    });
});


// *********************************************************//
// *********************************************************//
// *********************************************************//
// async function getId(parent, val) {
//     for (let i = 0; i < parent.children.length; i++) {
//       console.log(`parent.children[${i}].title is ${parent.children[i].title} and val is ${val}`)
//       if(parent.children[i].title === val){
//         return parent.children[i]
//       }
//     }  
// }
async function createFile(parent,url){
  console.log("createFile: "+ parent)
    return await chrome.bookmarks.create({
      'parentId': parent.id ,
      'title': url,
      'url': url,
    });
}
async function createFolder(parent,title){
  return await chrome.bookmarks.create(
    {'parentId': parent.id, 
    'title': title
  });
}

async function checkForExisting(val){
  /**
   *  scan all bookmarks
   *  those who have children are folders
   *  if folder name matches the current extension hook name make a folder insise with date and tome as name
   *  else create folder with spesified name 
   */

   let len = hook.children.length
   console.log("hook has x children: " + len)
   let par
   // checks if hook exists
   for (var i =0; i < len; i++) {
    let hookId = hook.id
    if(hook.children[i].title === val){
      console.log("match: " + val)
      // insert txt
      par = i
    }
   }
   // found hook with same name
   // inserts urls into folder with 
   if(par){
    console.log("hook.children[par]: "+ hook.children[par].title)
    // root
    let folder = await urlsAndFolder(hook.children[par])
    console.log("urls and folder return if true: "+folder.title)
    await insertUrls(folder)
   }
   else{
    let parents = await createFolder(hook, val)
    // let folder = await getId(parent, val)
    // console.log("hook.children[par]: "+ hook.children[id].title)
    let folder = await urlsAndFolder(parents)
    await insertUrls(folder)
   }

}
async function insertUrls(parent){
  let urls = await txtArea.value.split(URL_LINE_SPLIT_REGEX);
  console.log("urls len: "+ urls.length)
  console.log("urls [0]" + urls[0])
  for (let i = 0; i < urls.length; i++) {
    await createFile(parent, urls[i])
  }  
}
async function urlsAndFolder(parent){
  let time = await getTime() 
  console.log('time is: ' + time)
  let folder = await createFolder(parent, time)
  console.log("folder: " + folder)
  console.log("folder title: " + folder.title)
  // const newCreatedFolder = await getId(parent, time)
  // console.log("newCreatedFolder is: "+newCreatedFolder)
  return await folder 
}

async function getTime(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  
  console.log(dateTime)
  return dateTime
}

function getHook(book){
  for (var i =0; i < book.length; i++) {
    var bookmark = book[i]
    console.log("bookmark: " + book[i].title)
    console.log("bookmark child: " + book[i].children)
    if (bookmark.title === "extension_hook") {
      
      // sethook(bookmark)
      hook = bookmark
      console.log("hook: " + bookmark)
      console.log("hooktitle: " + bookmark.title)

    }
    if(bookmark.children){
      getHook(bookmark.children)
    }
  }
}


// *********************************************************//
// *********************************************************//

function loadSites(
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
            url: chrome.runtime.getURL('lazyloading.html#') + theurl,
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

// *********************************************************//
// *********************************************************//


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