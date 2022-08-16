export const StorageKey = {
    urlList: "txt",
    lazyLoad: "lazyload",
    localStorage: "localstorage",
    bookmarksStorage: "bookmarkstorage",
    preserve:  "preserve"
  }


export async function getStoredOptions() {
        const txtVal = await getFromStore(StorageKey.urlList)
        const lazyVal = await getFromStore(StorageKey.lazyLoad)
        const localVal = await getFromStore(StorageKey.localStorage)
        const bookmarksVal = await getFromStore(StorageKey.bookmarksStorage)
        const preserveVal = await getFromStore(StorageKey.preserve)
        
        console.log("txtVal is "+txtVal)
        return {
            txt: txtVal || '',
            lazyload: lazyVal|| false,
            localstorage: localVal|| false,
            bookmarksstorage: bookmarksVal|| false,
            preserve: txtVal|| preserveVal|| false,
          };

}
async function getFromStore(key) {
    const val = await getstoreValue(key)
    console.log("after get: "+val)
    return await val
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
    console.log("myVal is "+myVal[key]); 
    return await myVal[key]
}


  