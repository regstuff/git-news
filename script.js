// Define Config
//const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const config = {
    'maxPublishTime': 1*24*3600*1000, // 1 day in milliseconds
    'maxDescLen': 200, // Max number of characters
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
        //$.getJSON('https://server.regstuff.repl.co/rsstojson?url=' + encodeURIComponent(value), function(data) {  
            console.log('getJSON success for:', value)
            //newfeed = newfeed + parseFeed2(data, value)
            newfeed = newfeed + parseFeed(data, value)
            $(`#card_${listIndex} > ul.rssList`).html(newfeed);
            if(newfeed == '') {$(`#card_${listIndex} > ul.rssList`).html('Nothing new here right now<br>')}
        });
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

function parseFeed2(data, url) { // https://stackoverflow.com/a/7067582/3016570
//    let newsPublisher = new URL(url).hostname.replace('www.','') // https://stackoverflow.com/a/54947757/3016570
    let newsPublisher = data['feed']['title']
    console.log('Parsing feed of:', newsPublisher)
    let newfeed = ''
    $.each(data['entries'], function(index, value) {
        //var $this = $(this),
            item = {
                title: value['title'],
                link: value['link'],
                description: value['summary'],
                pubDate: value['published_parsed'],
                author: value['author']
        }
        console.log(item)
        var today = new Date();
        var currentDateTimestamp = today.getTime();
        /*var pubDay = item['pubDate'].slice(5,-15).split(' ')[0];
        var pubMonth = months.indexOf(item['pubDate'].slice(5,-15).split(' ')[1])+1;
        if (pubMonth < 10) {pubMonth = '0' + pubMonth}
        var pubYear = item['pubDate'].slice(5,-15).split(' ')[2];
        selectedDateTimestamp = pubYear + '-' + pubMonth + '-' + pubDay*/
        selectedDateTimestamp = new Date(item['pubDate']).getTime() 
        if (currentDateTimestamp-selectedDateTimestamp < config['maxPublishTime']) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,config['maxDescLen'])}</div></li>`; 
        }
    });
    return newfeed 
};


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
        if (currentDateTimestamp-selectedDateTimestamp < config['maxPublishTime']) {
        newfeed += `<li><div class='itemTitle'><a href='${item['link']}' target='_blank'>${item['title']}</a></div><div class='itemPublisher'>${newsPublisher}</div><div class='itemContent'>${item['description'].slice(0,config['maxDescLen'])}</div></li>`; 
        }
    });
    return newfeed 
};

function sleep(milliseconds) { //https://stackoverflow.com/a/65273224/3016570
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
