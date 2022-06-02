// Define Config
//const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const maxPublishTime = 1*24*3600*1000; // 1 day in milliseconds
const maxDescLen = 200; // number of characters
// End Define Config

$(document).ready(function() {
    



    
    
    
$('h1.feed1').html('Wired')

rssurl = ['https://www.wired.com/feed/category/business/latest/rss', 'http://feeds.nytimes.com/nyt/rss/Technology']

$('div.feed1').html('<ul class="rssList">')
var newfeed = ''
$.each(rssurl, function (index, value) {
    $.getJSON('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(value), function(data) {  
        //console.log(data['items'][0]['title'])
        newfeed = newfeed + parseFeed(data, value)
        $('div.feed1 > ul.rssList').html(newfeed)
    });
});






});


/*function parseFeed(data, url) { // https://stackoverflow.com/a/7067582/3016570
    var $xml = $(data);
    let newsPublisher = new URL(url).hostname.replace('www.','') // https://stackoverflow.com/a/54947757/3016570
    console.log(newsPublisher)
    let newfeed = '<ul class="rssList">'
    $xml.find("item").each(function() {
        var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
                author: $this.find("author").text()
        }
        var today = new Date();
        var currentDateTimestamp = today.getTime();
        var pubDay = item['pubDate'].slice(5,-15).split(' ')[0];
        var pubMonth = months.indexOf(item['pubDate'].slice(5,-15).split(' ')[1])+1;
        if (pubMonth < 10) {pubMonth = '0' + pubMonth}
        var pubYear = item['pubDate'].slice(5,-15).split(' ')[2];
        selectedDateTimestamp = pubYear + '-' + pubMonth + '-' + pubDay
        selectedDateTimestamp = new Date(selectedDateTimestamp).getTime() 
        if (currentDateTimestamp-selectedDateTimestamp < maxPublishTime) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,maxDescLen)}</div></li>`; 
        }
    });
    $('div.feed1').html(newfeed + '</ul>')
};*/

function parseFeed(data, url) { // https://stackoverflow.com/a/7067582/3016570
//    let newsPublisher = new URL(url).hostname.replace('www.','') // https://stackoverflow.com/a/54947757/3016570
    let newsPublisher = data['feed']['title']
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
        if (currentDateTimestamp-selectedDateTimestamp < maxPublishTime) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,maxDescLen)}</div></li>`; 
        }
        //console.log(newfeed)
    });
    return newfeed 
};
