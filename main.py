import feedparser, re, time, json

with open('config.js', 'r') as f: # Get config from file
    config = f.read().replace('const config = ','').strip() # Remove Javascript stuff
    
config = eval(re.sub(r'((?<!:)//).*?\n','', config).replace('\n','').replace(';','')) # Remove Javascript stuff

rss2json = dict()

time_now = time.time()

for rss_category in config['rssurl']:
    rss2json[rss_category] = dict()
    for rss_url in config['rssurl'][rss_category]:
        print(rss_url)
        rss2json[rss_category][rss_url] = dict()
        print('dict copy')
        rss2json[rss_category][rss_url] = feedparser.parse(rss_url)
        print('feed parsed')
        
        print(rss2json[rss_category][rss_url]['feed']['title'])
        json_dict = rss2json[rss_category][rss_url]['entries'].copy()
        
        #print(rss2json[rss_category][rss_url]['headers'].keys())
        if 'bozo_exception' in rss2json[rss_category][rss_url]: rss2json[rss_category][rss_url].pop('bozo_exception', None) # bozo-exception results in a non-serializable JSON object
        
        for entry in json_dict:
            if time_now - time.mktime(entry['published_parsed']) > eval(str(config['maxPublishTime']))*60:
                rss2json[rss_category][rss_url]['entries'].remove(entry)
            else: 
                entry['published_js'] = time.strftime('%Y-%m-%d', entry['published_parsed'])
                
        print(len(rss2json[rss_category][rss_url]['entries']))

#with open('rss2jsontxt.js', 'w') as f: # Dump json into file
#    print('Writing JSON to txt')
#    f.write(f'const rss2json = {str(rss2json)};') # Write to a file that Javascript can use
    
with open('rss2json.js', 'w') as f: # Dump json into file
    print('Writing JSON to file')
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use
