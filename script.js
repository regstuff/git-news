// Define Config
//const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const config = {
    'maxPublishTime': 1*24*3600*1000, // 1 day in milliseconds
    'maxDescLen': 200, // Max number of characters
    'excludeTerms': ['Reactors',], // Exclude any titles with these terms. Case-sensitive
    'includeTerms': ['Reactors',], // Include any titles with these terms. Overrides exclude terms. Case-sensitive
    'rssurl': {'Scitech': ['https://www.wired.com/feed/tag/ai/latest/rss', 'https://www.wired.com/feed/category/science/latest/rss', 'https://www.wired.com/feed/category/security/latest/rss', 'https://www.newscientist.com/subject/physics/feed/', 'https://www.newscientist.com/subject/technology/feed/', 'https://www.newscientist.com/subject/space/feed/'],
    'Nature': ['https://www.newscientist.com/subject/earth/feed/', 'https://www.newscientist.com/subject/life/feed/', 'https://www.newscientist.com/subject/humans/feed/'],
    'Longform': ['https://www.newscientist.com/section/features/feed/', 'https://www.wired.com/feed/category/ideas/latest/rss', 'https://www.wired.com/feed/tag/wired-guide/latest/rss', 'https://www.wired.com/feed/category/backchannel/latest/rss'],
    'Health': ['https://www.newscientist.com/subject/health/feed/',],
    },
};
const rss2json_api = 'rgocpeud5uvoylffbwmszslyptrxidyzvwvxohjr'
// End Define Config
$(document).ready(function() {

$.each(config['rssurl'],function(listIndex, listElement){
    console.log('Looping through RSS Category:', listIndex)
    $('body').append(`<div class="cardContainer"><h1 class="rssCard" id="title_${listIndex}">${listIndex}</h1><div class="rssCard" id="card_${listIndex}"><ul class="rssList">content_${listIndex}</ul></div></div>`)
    var newfeed = ''

    $.each(listElement, function (index, value) {
        console.log('Looping through RSS URL:', value)
        $.getJSON('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(value) + '&api_key=' + rss2json_api + '&order_by=pubDate', function(data) {  
            console.log('getJSON success for:', value)
            newfeed = newfeed + parseFeed(data, value)
            $(`#card_${listIndex} > ul.rssList`).html(newfeed);
            if(newfeed == '') {$(`#card_${listIndex} > ul.rssList`).html('Nothing new here right now<br>')}
        });
    });
});





});



function parseFeed(data, url) { // https://stackoverflow.com/a/7067582/3016570
//    let newsPublisher = new URL(url).hostname.replace('www.','') // https://stackoverflow.com/a/54947757/3016570
    let newsPublisher = data['feed']['title']
    console.log('Parsing feed of:', newsPublisher)
    let newfeed = ''
    $.each(data['items'], function(index, value) {
        //var $this = $(this),
            item = {
                title: value['title'],
                link: value['link'],
                description: value['description'],
                pubDate: value['pubDate'],
                author: value['author']
        }
        
        var today = new Date();
        var currentDateTimestamp = today.getTime();
        /*var pubDay = item['pubDate'].slice(5,-15).split(' ')[0];
        var pubMonth = months.indexOf(item['pubDate'].slice(5,-15).split(' ')[1])+1;
        if (pubMonth < 10) {pubMonth = '0' + pubMonth}
        var pubYear = item['pubDate'].slice(5,-15).split(' ')[2];
        selectedDateTimestamp = pubYear + '-' + pubMonth + '-' + pubDay*/
        selectedDateTimestamp = new Date(item['pubDate']).getTime() 
        if (itemValid(item)) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,config['maxDescLen'])}</div></li>`; 
        }
    });
    return newfeed 
};

function itemValid(item) { // Checks to see if item should be included in feed
    /*var pubDay = item['pubDate'].slice(5,-15).split(' ')[0];
    var pubMonth = months.indexOf(item['pubDate'].slice(5,-15).split(' ')[1])+1;
    if (pubMonth < 10) {pubMonth = '0' + pubMonth}
    var pubYear = item['pubDate'].slice(5,-15).split(' ')[2];
    selectedDateTimestamp = pubYear + '-' + pubMonth + '-' + pubDay*/
    timediff = new Date($.now()).getTime() - new Date(item['pubDate']).getTime(); // Get timediff between now and when this article was published
    termExcluded = config['excludeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) // True if title contains any of the terms to exclude - https://stackoverflow.com/a/5582621/3016570
    termIncluded = config['includeTerms'].some(function(v) { return item['title'].indexOf(v) >= 0; }) // True if title contains any of the terms to include
    //console.log('termIncluded:',termIncluded)
    boolval = !(timediff > config['maxPublishTime'] || (termExcluded && !termIncluded)) // Check all conditions
    //console.log('Boolvals:',item['title'], boolval)
    return boolval
}
