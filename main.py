import feedparser, re, time, json

with open('config.js', 'r') as f: # Get config from file
    config = f.read().replace('const config = ','').strip() # Remove Javascript stuff
    
config = eval(re.sub(r'((?<!:)//).*?\n','', config).replace('\n','').replace(';','')) # Remove Javascript stuff

rss2json = dict()

for rss_category in config['rssurl']:
    rss2json[rss_category] = dict()
    for rss_url in config['rssurl'][rss_category]:
        rss2json[rss_category][rss_url] = dict()
        rss_feed = feedparser.parse(rss_url)
        rss2json[rss_category][rss_url] = feedparser.parse(rss_url)
        print(rss2json[rss_category][rss_url]['feed']['title'])
        #for entry in rss2json['rss_category']['rss_url']['entries']:
        #    print(entry['title'], entry['link'], time.strftime('%Y-%m-%d', entry['published_parsed']))
        #    print(entry['summary'])
        #    print(entry['media_thumbnail'][0]['url'])

with open('rss2json.js', 'w') as f: # Dump json into file
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use
