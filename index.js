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
    function saveAndPrint(key,string,checked){
        console.log(`Loaded ${string}`);
        console.log(`${string} is: ${checked}`);
        storeValue(key, checked)
        getstoreValue(key) 
    }
    reload.addEventListener("click", () => {
        chrome.runtime.reload()
    });

    
});

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
    const txt = myOptions.txt
    console.log("txt: "+ txt)
    const lazyLoad = myOptions.lazyload
    console.log("lazyLoad: "+ lazyLoad)
    const localStorage = myOptions.localstorage  
    console.log("localStorage: "+ localStorage)
    const bookmarksStorage = myOptions.bookmarksstorage
    console.log("bookmarksStorage: "+ bookmarksStorage)
    const preserve = myOptions.preserve
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