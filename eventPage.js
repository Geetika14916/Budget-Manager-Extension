var contextMenuItem ={
    "id" : "spendMoney" ,
    "title" : "Spend Money",
    "contexts" : ["selection"]
} ;

chrome.contextMenus.create(contextMenuItem) ;

function isInt(value)
{
    return !isNaN(value) && 
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value , 10)) ;
}

chrome.contextMenus.onClicked.addListener(function(clickData)
{
    if(clickData.menuItemId == "spendMoney"  && clickData.selectionText)
    {
        if(isInt(clickData.selectionText))
        {
            chrome.storage.sync.get(['total' , 'limit'], function(budget)
            {
                var newTotal =0 ;

                if(budget.total)
                {
                    newTotal +=parseInt(budget.total) ;
                }

                newTotal += parseInt(clickData.selectionText) ;

                chrome.storage.sync.set({'total': newTotal}, function() {
                    if (newTotal >= budget.limit) {
                        var notify = {
                            type: "basic",
                            iconUrl: "icon48.png",
                            title: "Limit Reached!",
                            message: "Uh oh! Looks like you've reached your limit!"
                        };
    
                        chrome.notifications.create('limitNotif' + Date.now().toString(), notify);
                    }
                });
            })
        }
    }
}) ;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.totalReset) {
        console.log("Message received in event page");
        chrome.action.setBadgeText({ text: '0' });
    }
});



chrome.storage.onChanged.addListener(function(changes , storageName)
{
    if (changes.total && changes.total.newValue) {
        chrome.action.setBadgeText({ text: changes.total.newValue.toString() });
    }
});
