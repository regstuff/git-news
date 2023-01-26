import feedparser, re, time, json
print('0')
with open('config.js', 'r') as f: # Get config from file
    config = f.read().replace('const config = ','').strip() # Remove Javascript stuff
    print('1')
    
config = eval(re.sub(r'((?<!:)//).*?\n','', config).replace('\n','').replace(';','')) # Remove Javascript stuff
print('config', config)

rss2json = dict()
all_titles = []
maxPublishTime = eval(str(config['maxPublishTime'])) # in minutes
hrsTime = int(maxPublishTime/60) # For Google News RSS - needed in hours

time_now = time.time()

for rss_category in config['rssurl']:
    print(rss_category)
    rss_category_renamed = rss_category.replace('/','_') # If category name has /, class and id names in html will break
    rss2json[rss_category_renamed] = dict()
    for rss_url_full in config['rssurl'][rss_category]:
        rss_url = rss_url_full.split('::')[0]
        print(rss_url)
        if 'http:' in rss_url or 'https:' in rss_url: feedurl = rss_url # Proper rss feed. Use feedparser to get the data
        else: feedurl = f"https://news.google.com/rss/search?q=allinurl:{rss_url}+when:{hrsTime}h&ceid=IN:en&hl=en-IN&gl=IN" # Use Google News url (https://newscatcherapi.com/blog/google-news-rss-search-parameters-the-missing-documentaiton)
        print(feedurl)   
        try: 
            print('trying')
            rss_feed = feedparser.parse(feedurl) # Proper rss feed. Use feedparser to get the data
            print('done')
        except: print('Unable to get rss feed from', rss_url)
        
        if rss_feed.status == 200: 
            print('status is 200')
            rss2json[rss_category_renamed][rss_url] = dict()
            rss2json[rss_category_renamed][rss_url]['feed'] = dict()
            rss2json[rss_category_renamed][rss_url]['entries'] = []
            if 'http:' in rss_url or 'https:' in rss_url: rss2json[rss_category_renamed][rss_url]['feed']['title'] = rss_feed['feed']['title']
            else: rss2json[rss_category_renamed][rss_url]['feed']['title'] = rss_feed['feed']['title'].split(' ')[0].replace('"allinurl:','') # Get title from rss feed, strtpping out Google search params
            print(rss2json[rss_category_renamed][rss_url]['feed']['title'])                

            for entry in rss_feed['entries']:
                if entry['published_parsed']: 
                    if time_now - time.mktime(entry['published_parsed']) < maxPublishTime*60: # Only add entries within maxPublishedTime
                        entry_dict = dict()
                        if 'title' in entry: entry_dict['title'] = entry['title']
                        else: entry_dict['title'] = 'None'
                        if 'summary' in entry: entry_dict['summary'] = re.sub(r'<.*?>', '', entry['summary'])
                        else: entry_dict['summary'] = 'None'
                        if 'link' in entry: entry_dict['link'] = entry['link']
                        else: entry_dict['link'] = 'None'
                        entry_dict['published_js'] = time.strftime('%Y-%m-%d', entry['published_parsed'])
                        if 'author' in entry: entry_dict['author'] = entry['author']
                        else: entry_dict['author'] = 'None'
                        if entry['title'] not in all_titles:
                            all_titles.append(entry['title'])
                            if '::' in rss_url_full: # Apply filters
                                if eval(rss_url_full.split('::')[1]): rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)
                            else: rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)


            print(len(rss2json[rss_category_renamed][rss_url]['entries']))
        
        else: print(rss_url, 'not available')
    
with open('rss2json.js', 'w') as f: # Dump json into file
    print('Writing JSON to file')
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use
