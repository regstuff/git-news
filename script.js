$(document).ready(function() {
    populateFeedList()
});

// Populate body element with list of RSS feeds
function populateFeedList() {
    $.each(rss2json,function(listIndex, listElement){
        console.log('Looping through RSS Category:', listIndex)
        //$('body').append(`<div class="cardContainer"><h1 class="rssCard" id="title_${listIndex}">${listIndex}</h1><div class="rssCard" id="card_${listIndex}"><ul class="rssList">content_${listIndex}</ul></div></div>`)
        var newfeed = ''
        $.each(listElement, function (index, value) {
            console.log('Looping through RSS URL:', value['feed']['title'])
            $.each(value['entries'], function(index, data) {  
                console.log('Looping through title:', data['title'])
                newfeed = newfeed + parseFeed(data, value['feed']['title'])
            });
        });
        if (newfeed != '') { // Create card if feed is not empty
            //let columnNum = `rssColumn_${$('.cardContainer').length % 3}` // Calculate number of existing elements of class cardContainer. Decide which column to place in.
            appendColumn(listIndex, newfeed)
        }
    });
}

// Function that appends html content to a div of id rssColumn_x
function appendColumn(listIndex, newfeed) {
    $(`#${findMinHeight().colId}`).append(`<div class="cardContainer"><h1 class="rssCard" id="title_${listIndex}">${listIndex.replaceAll('_','/')}</h1><div class="rssCard" id="card_${listIndex}"><ul class="rssList">content_${listIndex}</ul></div></div>`)
    $(`#card_${listIndex} > ul.rssList`).html(newfeed);
}

// Parse the JSON dump and return html
function parseFeed(data, value) { // https://stackoverflow.com/a/7067582/3016570
    let newsPublisher = value
    let newfeed = ''
    item = {
        title: data['title'],
        link: data['link'],
        description: data['summary'],
        pubDate: data['published_js'],
        //author: data['author']
    }
    //console.log('Parsed feed of:', item['title'])
    if (itemValid(item)) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,config['maxDescLen'])}</div></li>`; 
    }
    return newfeed 
};

function itemValid(item) { // Checks to see if item should be included in feed
    timediff = new Date($.now()).getTime() - new Date(item['pubDate']).getTime(); // Get timediff between now and when this article was published
    termExcluded = config['excludeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) || config['excludeTerms'].some(function(v) { return item['title'].indexOf(v.toUpperCase()) >= 0; }) // True if title contains any of the terms (as is & capitalized) to exclude - https://stackoverflow.com/a/5582621/3016570
    termIncluded = config['includeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) // True if title contains any of the terms to include
    //boolval = !(timediff > config['maxPublishTime']*60*1000 || (termExcluded && !termIncluded)) // Check all conditions
    boolval = !((termExcluded && !termIncluded)) // Check all conditions
    return boolval
}

function findMinHeight() {
    var minHeight = $('#rssColumn_0').height();
    var colId = 'rssColumn_0';
    $('.rssColumn').each(function() { 
        if ($(this).height() < minHeight) {
            console.log($(this).attr('id'), $(this).height())
            minHeight = $(this).height();
            colId = $(this).attr('id');
        }
    });
    return {minHeight, colId};
}
