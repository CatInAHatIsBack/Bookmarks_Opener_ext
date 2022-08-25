

let inputVal
let tabCountInfo
let checkBox 

const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

export const StorageKey = {
    urlList: 'urls',
    lazyLoad: "lazyload",
    preserve:  "preserve"
  }

export async function getStoredOptions() {
        const txtVal = await getstoreValue(StorageKey.urlList)
        const lazyVal = await getstoreValue(StorageKey.lazyLoad)
        const preserveVal = await getstoreValue(StorageKey.preserve)
        
        console.log("txtVal is "+txtVal)
        return {
            txt: txtVal || '',
            lazyload: lazyVal|| false,
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
    return  await myVal[key]
}

export function setOpt(myOptions){
    inputVal.txtArea.value = myOptions.txt
    lazyLoad.checked = myOptions.lazyload 
    preserve.checked = myOptions.preserve
}
export function printOpt(myOptions) {
    const txt = myOptions.txt
    const lazyLoad = myOptions.lazyload
    const preserve = myOptions.preserve
    console.log()
    console.log("Options are: ")
    console.log("txt: "+ txt)
    console.log("lazyLoad: "+ lazyLoad)
    console.log("preserve: "+ preserve)
}
export function saveAndPrint(string){
    let key
    let value 
    switch(string) {
      case "preserve":
        key = StorageKey.preserve
        value = preserve.checked 
        console.log("preserve chosen")
        break;
      case "lazyLoad":
        key = StorageKey.lazyLoad
        value = lazyLoad.checked
        console.log("lazy chosen")
        break;
      case "txtArea":
        key = StorageKey.urlList
        value = inputVal.txtArea.value
        console.log("textArea chosen and changed")
        break;
      default:
        console.log("not defined")
    }
        console.log(`Loaded ${string}`);
        console.log(`${string} is: ${value}`);
        storeValue(key, value)
        getstoreValue(key) 
    }

export async function getMyOpt() {
        const myOptions = await getStoredOptions() 
        printOpt(myOptions) 
        setOpt(myOptions)
        updateTabCount() 
}
export const updateTabCount = () => {
    let tabCount = '0';
    
    if (inputVal.txtArea.value) {
      const lines = inputVal.txtArea.value.split(URL_LINE_SPLIT_REGEX);
      if (lines.length <= 5000) {
        tabCount = String(lines.filter((line) => line.trim() !== '').length);
      } else {
        tabCount = '> 5000';
        console.log("too many urls")
      }
      console.log("changed line count")
    }

    tabCountInfo.tabCountNumber.textContent = tabCount;
    tabCountInfo.tabCountVis.style.visibility = tabCount === '0' ? 'hidden' : 'visible'; 
    tabCountInfo.tabCountLabel.textContent = tabCount === '1' ? 'tab' : 'tabs';
  };