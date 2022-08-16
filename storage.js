export const StorageKey = {
    urlList: "txt",
    lazyLoad: "lazyload",
    localStorage: "localstorage",
    bookmarksStorage: "bookmarkstorage",
    preserve:  "preserve"
  }


export async function getStoredOptions() {
    // try {
        const txtVal = await getFromStore(StorageKey.urlList)
        const lazyVal = await getFromStore(StorageKey.lazyLoad)
        console.log("lazyVal in "+lazyVal)
        const localVal = await getFromStore(StorageKey.localStorage)
        const bookmarksVal = await getFromStore(StorageKey.bookmarksStorage)
        const preserveVal = await getFromStore(StorageKey.preserve)
        
        console.log("got")
        // const opt = await [{
        //     txt: (txtVal === null || txtVal === void 0 ? void 0 : txtVal.txt) || '',
        //     lazyload: (lazyVal === null || lazyVal === void 0 ? void 0 : lazyVal.lazyload) || false,
        //     localstorage: (localVal=== null || localVal === void 0 ? void 0 : localVal.localstorage) || false,
        //     bookmarksstorage: (bookmarksVal === null || bookmarksVal === void 0 ? void 0 : bookmarksVal.bookmarkstorage) || false,
        //     preserve: (txtVal === null || txtVal === void 0 ? void 0 : txtVal.txt) || (preserveVal === null || preserveVal === void 0 ? void 0 : preserveVal.preserve) || false,
        // }];  
        // console.log("opt lazy "+opt)
        return {
            txt: txtVal|| '',
            lazyload: lazyVal|| false,
            localstorage: localVal|| false,
            bookmarksstorage: bookmarksVal|| false,
            preserve: txtVal|| preserveVal|| false,
          };
    // } catch (err) {
    //     console.log(err)
    // }
    // console.log("lazyVal out "+lazyVal)
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


  