# Bookmarks_Opener_ext


Dont wanna pay 5$ google account fee so if you are interested build from git yourself.

To check it out just clone the repo, then go to chrome://extensions/, then load unpacked and choose your downloaded dir.

This is a no dependency chrome ext for opening list of links and/or saving to  bookmarks.

To save to bookmarks you need to create a bookmark on the "Bookmarks Bar" called and call it extension_hook.
folder names will be saved as date and time of creation. 

If preserve is checked it will store values in chrome.storage.local. On input it will debounce save.

Restore will get options from storage