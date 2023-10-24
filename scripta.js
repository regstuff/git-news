$(document).ready(function() {
    populateFeedList()
});

// Populate body element with list of RSS feeds
function populateFeedList() {
    $.each(rss2json,function(listIndex, listElement){
        console.log('Looping through RSS Category:', listIndex)
        newfeed = `<p>New category, ${listIndex.replaceAll('_','/')}. `

        $.each(listElement, function (index, value) {
            console.log('Looping through RSS URL:', value['feed']['title'])
            $.each(value['entries'], function(index, data) {  
                console.log('Looping through title:', data['title'])
                newfeed = newfeed + parseFeed(data, value['feed']['title'])
            });
        });

        if (newfeed.split('.').length > 3) { // Add category if there is atleast one article
            $('body').append(newfeed)
        }
        
    });
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
        console.log(newsPublisher)
        if (newsPublisher != "Today I Learned (TIL)") {
            // Check if the string "Summary:" is present in item['description']
            if (item['description'].includes("Summary:")) {
                newfeed += `Next article, ${item['title']}. ${item['description'].slice(0,config['maxDescLen'])}. `; 
            } else {
                newfeed += `Next article, ${item['title']}. Summary is, ${item['description'].slice(0,config['maxDescLen'])}. `; 
            }
        } else {
            newfeed += `Next article, ${item['title']}. `;
        }
    }
    return newfeed 
};

function itemValid(item) { // Checks to see if item should be included in feed
    timediff = new Date($.now()).getTime() - new Date(item['pubDate']).getTime(); // Get timediff between now and when this article was published
    termExcluded = config['excludeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) || config['excludeTerms'].some(function(v) { return item['title'].indexOf(v[0].toUpperCase() + v.slice(1)) >= 0; }) // True if title contains any of the terms (as is & capitalized) to exclude - https://stackoverflow.com/a/5582621/3016570
    termIncluded = config['includeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) // True if title contains any of the terms to include
    //boolval = !(timediff > config['maxPublishTime']*60*1000 || (termExcluded && !termIncluded)) // Check all conditions
    boolval = !((termExcluded && !termIncluded)) // Check all conditions
    return boolval
}