$(function()
{
    chrome.storage.sync.get('limit' , function(budget)
    {
        $('#limit').val(budget.limit) ;
    })

    $('#saveLimit').click(function()
    {
        var limit = $('#limit').val() ;
        if(limit)
        {
            chrome.storage.sync.set({'limit' : limit} , function()
            {
                close() ;
            }) ;
        }
    }) ;

    $('#resetTotal').click(function()
    {
        chrome.storage.sync.set({'total' : 0}, function()
        {
                var notify =
                {
                    type : "basic" ,
                    iconUrl  : "icon48.png" ,
                    title : "Total Reset !" ,
                    message : "The total has been reset to 0!"
                } ;

                chrome.notifications.create('limitNotif' + Date.now().toString(), notify, function()
                {
                    chrome.runtime.sendMessage({ totalReset: true });
                    console.log("Message sent from options page");
                    
                    close() ;
                }) ;

               
            
        });
    });



});