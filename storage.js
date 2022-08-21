export const StorageKey = {
    urlList: "txt",
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


  