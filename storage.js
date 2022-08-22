

let inputVal
let tabCountInfo
let checkBox 

const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

export const StorageKey = {
    urlList: 'urls',
    lazyLoad: "lazyload",
    localStorage: "localstorage",
    bookmarksStorage: "bookmarkstorage",
    preserve:  "preserve"
  }

export async function getStoredOptions() {
        const txtVal = await getstoreValue(StorageKey.urlList)
        const lazyVal = await getstoreValue(StorageKey.lazyLoad)
        const localVal = await getstoreValue(StorageKey.localStorage)
        const bookmarksVal = await getstoreValue(StorageKey.bookmarksStorage)
        const preserveVal = await getstoreValue(StorageKey.preserve)
        
        console.log("txtVal is "+txtVal)
        return {
            txt: txtVal || '',
            lazyload: lazyVal|| false,
            localstorage: localVal|| false,
            bookmarksstorage: bookmarksVal|| false,
            preserve: preserveVal|| false,
          };

}

export function setUi(input, tabcount, checkbox){
  inputVal = input 
  tabCountInfo = tabcount
  checkBox = checkbox
}
export async function storeValue(key, value) {
    await chrome.storage.local.set({[key]: value}, function() {
        console.log(key + ': set value to ' + value);
      });
}
export async function getstoreValue(key) {
    let myVal = await chrome.storage.local.get([key])
            console.log(key + ': get value is ' + myVal[key]);
            console.log(myVal[key])
    console.log(key + ": myVal is "+myVal[key]); 
    return  await myVal[key]
}

export function setOpt(myOptions){
    inputVal.txtArea.value = myOptions.txt
    lazyLoad.checked = myOptions.lazyload 
    checkBox.localStorage.checked = myOptions.localstorage
    bookmarksStorage.checked = myOptions.bookmarksstorage
    preserve.checked = myOptions.preserve
}
export function printOpt(myOptions) {
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
export function saveAndPrint(key,string,value){
        console.log(`Loaded ${string}`);
        console.log(`${string} is: ${value}`);
        storeValue(key, value)
        getstoreValue(key) 
        // console.log("txt field was saved:")
    }
export function saveAndPrintUrl() {
    let key = StorageKey.urlList
    let string = "txtArea"
    let value = inputVal.txtArea.value
    if(preserve.checked){
        saveAndPrint(key,string,value) 
    }
}
export async function getMyOpt() {
        const myOptions = await getStoredOptions() 
        printOpt(myOptions) 
        setOpt(myOptions)
        updateTabCount() 
}
export const updateTabCount = () => {
    let tabCount = '0';
    
    console.log(inputVal.txtArea.value)
    if (inputVal.txtArea.value) {
      const lines = inputVal.txtArea.value.split(URL_LINE_SPLIT_REGEX);
      if (lines.length <= 5000) {
        // limit for performance reasons
        tabCount = String(lines.filter((line) => line.trim() !== '').length);
      } else {
        tabCount = '> 5000';
      }
      console.log("changed line count")
    }

    // console.log(tabCountInfo.tabCountNumber)
    console.log(tabCountInfo.tabCountLabel) 

    tabCountInfo.tabCountNumber.textContent = tabCount;
    tabCountInfo.tabCountVis.style.visibility = tabCount === '0' ? 'hidden' : 'visible'; 
    tabCountInfo.tabCountLabel.textContent = tabCount === '1' ? 'tab' : 'tabs';
  };