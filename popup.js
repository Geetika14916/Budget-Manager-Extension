$(function() {

    function updateProgressBar(total, limit) {
        var percentage = (total / limit) * 100;
        $('#progress').css('width', percentage + '%');
        if (percentage >= 100) {
            $('#progress').addClass('exceeded-limit');
        } else {
            $('#progress').removeClass('exceeded-limit');
        }
    }


    chrome.storage.sync.get(['total', 'limit'], function(budget) {
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
        updateProgressBar(budget.total || 0, budget.limit || 100);
    });

    $('#spendAmount').click(function() {
        chrome.storage.sync.get(['limit', 'total'], function(budget) {
            var newTotal = 0;
            if (budget.total) {
                newTotal += parseInt(budget.total);
            }

            var amount = $('#amount').val();

            if (amount) {
                newTotal += parseInt(amount);
            }

            chrome.storage.sync.set({'total': newTotal}, function() {
                if (amount && newTotal >= budget.limit) {
                    var notify = {
                        type: "basic",
                        iconUrl: "icon48.png",
                        title: "Limit Reached!",
                        message: "Uh oh! Looks like you've reached your limit!"
                    };

                    chrome.notifications.create('limitNotif' + Date.now().toString(), notify);
                }

                $('#total').text(newTotal);
                updateProgressBar(newTotal, budget.limit || 100);
            });

            $('#total').text(newTotal);
            $('#amount').val('');
        });
    });
});
