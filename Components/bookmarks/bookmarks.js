let hook
let inputVal
const URL_LINE_SPLIT_REGEX = /\r\n?|\n/g;

export function setHook(input, inputval){
    hook = input
    inputVal = inputval
}
async function createFile(parent,url){
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
   let par
   // checks if hook exists
   for (var i =0; i < len; i++) {
    let hookId = hook.id
    if(hook.children[i].title === val){
      par = i
    }
   }
   if(par){
    let folder = await urlsAndFolder(hook.children[par])
    if(inputVal.txtArea.value.trim() !== ''){
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
    let folder = await urlsAndFolder(parents)
    if(inputVal.txtArea.value.trim() !== ''){
      await insertUrls(folder)
    }
    
   }
}
export async function insertUrls(parent){
  let urls = await inputVal.txtArea.value.split(URL_LINE_SPLIT_REGEX);
  for (let i = 0; i < urls.length; i++) {
    if(urls[i].trim() !== ''){
        await createFile(parent, urls[i])
    }
  }  
}
async function urlsAndFolder(parent){
  let time = await getTime() 
  let folder = await createFolder(parent, time)
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