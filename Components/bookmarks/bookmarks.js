let hook
let inputVal
const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

export function setHook(input, inputval){
    hook = input
    inputVal = inputval
}
async function createFile(parent,url){
    // console.log("createFile: "+ parent.title)
    // console.log("substr: "+url.substring(0, 3))
    if(url.substring(0, 3) === 'www'){
      url = url.replace('www', 'http://www')
    }
      return await chrome.bookmarks.create({
        'parentId': parent.id ,
        'title': url.substring()
        .replace('http://', '')
        .replace('https://', ''),
        'url': url,
      });
  }
async function createFolder(parent,title){
    return await chrome.bookmarks.create(
      {'parentId': parent.id, 
      'title': title
    });
  }

export async function checkForExisting(val){
  /**
   *  scan all bookmarks
   *  those who have children are folders
   *  if folder name matches the current extension hook name make a folder insise with date and tome as name
   *  else create folder with spesified name 
   */

   let len = hook.children.length
  //  console.log("hook has x children: " + len)
   let par
   // checks if hook exists
   for (var i =0; i < len; i++) {
    let hookId = hook.id
    if(hook.children[i].title === val){
      // console.log("match: " + val)
      // insert txt
      par = i
    }
   }
   // found hook with same name
   // inserts urls into folder with 
   if(par){
    // console.log("hook.children[par]: "+ hook.children[par].title)
    // root
    let folder = await urlsAndFolder(hook.children[par])
    // console.log("urls and folder return if true: "+folder.title)
    if(inputVal.txtArea.value.trim() !== ''){
      // console.log("split: "+inputVal.txtArea.value.split(' '))
      await insertUrls(folder)
    }
   }
   else{
    let parents
    if( val.trim() === ''){
        parents = hook 
    }
    else{
        parents = await createFolder(hook, val)
    }
    // let folder = await getId(parent, val)
    // console.log("hook.children[par]: "+ hook.children[id].title)
    let folder = await urlsAndFolder(parents)
    if(inputVal.txtArea.value.trim() !== ''){
      // console.log("split: "+inputVal.txtArea.value.split(' '))
      await insertUrls(folder)
    }
    
   }
}
export async function insertUrls(parent){
  let urls = await inputVal.txtArea.value.split(URL_LINE_SPLIT_REGEX);
  // console.log("urls len: "+ urls.length)
  // console.log("urls [0]" + urls[0])
  for (let i = 0; i < urls.length; i++) {
    if(urls[i].trim() !== ''){
        await createFile(parent, urls[i])
    }
  }  
}
async function urlsAndFolder(parent){
  let time = await getTime() 
  // console.log('time is: ' + time)
  let folder = await createFolder(parent, time)
  // console.log("folder: " + folder)
  // console.log("folder title: " + folder.title)
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