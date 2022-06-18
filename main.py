import feedparser, re, time, json

with open('config.js', 'r') as f: # Get config from file
    config = f.read().replace('const config = ','').strip() # Remove Javascript stuff
    
config = eval(re.sub(r'((?<!:)//).*?\n','', config).replace('\n','').replace(';','')) # Remove Javascript stuff

rss2json = dict()

time_now = time.time()

for rss_category in config['rssurl']:
    rss_category_renamed = rss_category.replace('/','_') # If category name has /, class and id names in html will break
    rss2json[rss_category_renamed] = dict()
    for rss_url_full in config['rssurl'][rss_category]:
        rss_url = rss_url_full.split('::')[0]
        rss_feed = feedparser.parse(rss_url)
        rss2json[rss_category_renamed][rss_url] = dict()
        rss2json[rss_category_renamed][rss_url]['feed'] = dict()
        rss2json[rss_category_renamed][rss_url]['entries'] = []
        rss2json[rss_category_renamed][rss_url]['feed']['title'] = rss_feed['feed']['title']
        print(rss2json[rss_category_renamed][rss_url]['feed']['title'])                
     
        for entry in rss_feed['entries']:
            if time_now - time.mktime(entry['published_parsed']) < eval(str(config['maxPublishTime']))*60:
                entry_dict = {'title': entry['title'], 'summary': re.sub(r'<.*?>', '', entry['summary']), 'link': entry['link'], 'published_js': time.strftime('%Y-%m-%d', entry['published_parsed'])}
                if 'author' in entry: entry_dict['author'] = entry['author']
                else: entry_dict['author'] = None
                if '::' in rss_url_full:
                    if eval(rss_url_full.split('::')[1]): rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)
                else: rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)

                
        print(len(rss2json[rss_category_renamed][rss_url]['entries']))
    
with open('rss2json.js', 'w') as f: # Dump json into file
    print('Writing JSON to file')
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use
