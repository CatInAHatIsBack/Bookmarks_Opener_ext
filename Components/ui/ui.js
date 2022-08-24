
export const checkBoxKey = {
    lazyLoadCheckBox: "lazyLoad",
    // localStorageCheckBox: "localStorage",
    // bookmarksStorageCheckBox: "bookmarksStorage",
    preserveCheckBox:  "preserve"
  }



export const printButtonKey = {
  printLazy: "printlazy",
  // printLocal: "printlocal",
  // printBookmark: "printbookmark",
  printPreserve:  "printpreserve"
  }

export const functionButtonKey = {
  open: "open",
  extract: "extract",
  reload: "reload",
  restore:  "restore",
  saveToBookmarks: "saveToBookmarks"
  }

export const inputKey = {
    URLInput: "urls",
    ProjectName: "projectName",
  }

export const tabCountKey = {
  tabCountVis: "tabcount",
  tabCountLabel:  "tabcountLabel",
  tabCountNumber: "tabcountNumber"
  
}




export function getUiCheckBox() {
const lazyLoad = document.getElementById(checkBoxKey.lazyLoadCheckBox);
const localStorage = document.getElementById(checkBoxKey.localStorageCheckBox);
const bookmarksStorage = document.getElementById(checkBoxKey.bookmarksStorageCheckBox);
const preserve = document.getElementById(checkBoxKey.preserveCheckBox);
    return {
      lazyLoad :  lazyLoad,
      localStorage : localStorage,
      bookmarksStorage : bookmarksStorage,
      preserve : preserve
    }

}
export function getUiprintButton() {
const printLazy = document.getElementById(printButtonKey.printLazy);
// const printLocal = document.getElementById(printButtonKey.printLocal);
// const printBookmark = document.getElementById(printButtonKey.printBookmark);
const printPreserve = document.getElementById(printButtonKey.printPreserve);


    return {
      printLazy : printLazy,
      // printLocal : printLocal,
      // printBookmark : printBookmark,
      printPreserve : printPreserve,
    }

}
export function getUiFunctionButton() {
const open = document.getElementById(functionButtonKey.open)
const extract = document.getElementById(functionButtonKey.extract)
const reload = document.getElementById(functionButtonKey.reload);
const restore = document.getElementById(functionButtonKey.restore);
const saveToBookmarks = document.getElementById(functionButtonKey.saveToBookmarks) 


  return {
    open : open,
    extract : extract,
    reload : reload,
    restore : restore,
    saveToBookmarks : saveToBookmarks,
  }

}
export function getUiInput() {
const txtArea = document.getElementById(inputKey.URLInput)
const projectName = document.getElementById(inputKey.ProjectName) 

    return {
      txtArea : txtArea,
      projectName : projectName,
    }

}
export function getUiTabCount() {
const tabCountVis = document.getElementById(tabCountKey.tabCountVis)
const tabCountLabel = document.getElementById(tabCountKey.tabCountLabel)
const tabCountNumber = document.getElementById(tabCountKey.tabCountNumber)

    return {
      tabCountNumber : tabCountNumber,
      tabCountVis : tabCountVis,
      tabCountLabel : tabCountLabel,
    }

}

