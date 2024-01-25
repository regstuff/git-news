import feedparser, re, time, json, requests, os
# import numpy as np
# import torch
# from omegaconf import OmegaConf
# from IPython.display import Audio, display

# print('Loading Silero models')

# torch.hub.download_url_to_file('https://raw.githubusercontent.com/snakers4/silero-models/master/models.yml', 'latest_silero_models.yml', progress=False)
# models = OmegaConf.load('latest_silero_models.yml')
# print('Downloaded YAML of Silero models')


# language = 'en'
# model_id = 'v3_en'
# device = torch.device('cpu')
# model, example_text = torch.hub.load(repo_or_dir='snakers4/silero-models', model='silero_tts', language=language, speaker=model_id)
# model.to(device)  # gpu or cpu

# print('Loaded Silero models. Configuring voice')

# sample_rate = 24000
# speaker = "en_24"
# put_accent=False
# put_yo=False
# example_text = 'Tom Brady. New blood test more convenient for measuring important omega-3 levels'

# audio = model.apply_tts(text=example_text, speaker=speaker, sample_rate=sample_rate, put_accent=put_accent, put_yo=put_yo)
# audio_obj = Audio(audio, rate=sample_rate)
# with open('output.mp3', 'wb') as f: f.write(audio_obj.data)

# print('Example output.mp3 done.')

# all_audios = []

print('Loading config.js')

with open('config.js', 'r') as f: # Get config from file
    config = f.read().replace('const config = ','').strip() # Remove Javascript stuff
    print('Loaded config.js')
    
config = eval(re.sub(r'((?<!:)//).*?\n','', config).replace('\n','').replace(';','')) # Remove Javascript stuff
print('config', config)

rss2json = dict()
all_titles = []
maxPublishTime = eval(str(config['maxPublishTime'])) # in minutes
hrsTime = int(maxPublishTime/60) # For Google News RSS - needed in hours

time_now = time.time()
tts_text = ''

for rss_category in config['rssurl']:
    print(rss_category)
    tts_text = f'New catgeory started. {rss_category}.'
    rss_category_renamed = rss_category.replace('/','_') # If category name has /, class and id names in html will break
    rss2json[rss_category_renamed] = dict()
    for rss_url_full in config['rssurl'][rss_category]:
        rss_url = rss_url_full.split('::')[0]
        print(rss_url)
            
        if 'oauth.reddit.com' in rss_url: # Use reddit's api as rss feeds are blocked
            clientid = os.environ['clientid'] # Details here https://www.reddit.com/prefs/apps
            clientpass = os.environ['clientpass']
            rusername = os.environ['rusername']
            ruserpass = os.environ['ruserpass']
            
            client_auth = requests.auth.HTTPBasicAuth(clientid, clientpass) # HowTo - https://www.reddit.com/dev/api/#GET_top
            post_data = {"grant_type": "password", "username": rusername, "password": ruserpass}
            rheaders = {"User-Agent": "personalscript/0.1 by regstuff"}
            response = requests.post("https://www.reddit.com/api/v1/access_token", auth=client_auth, data=post_data, headers=rheaders)
            toke = response.json()
            rheaders = {"Authorization": f"bearer {toke['access_token']}", "User-Agent": "personalscript/0.1 by regstuff"}
            response = requests.get(rss_url, headers=rheaders)
            entries = response.json()['data']['children']
            print('REDDIT ENTRIES', entries)
            rss2json[rss_category_renamed][rss_url] = dict()
            rss2json[rss_category_renamed][rss_url]['feed'] = dict()
            
            if '.json' not in rss_url: rss2json[rss_category_renamed][rss_url]['entries'] = [{'title': re.sub(r'https?://\S+', '', x['data']['title'].replace('`', '')), 'summary': re.sub(r'https?://\S+', '', x['data']['selftext'].replace('`', '')), 'link': x['data']['url_overridden_by_dest'], 'author': 'None'} for x in entries if time_now-x['data']['created']<maxPublishTime*60]
            else: rss2json[rss_category_renamed][rss_url]['entries'] = [{'title': re.sub(r'https?://\S+', '', x['data']['title'].replace('`', '')), 'summary': re.sub(r'https?://\S+', '', x['data']['selftext'].replace('`', '')), 'link': x['data']['url'], 'author': 'None'} for x in entries if time_now-x['data']['created']<maxPublishTime*60]
            rss2json[rss_category_renamed][rss_url]['feed']['title'] = 'Reddit - TIL'

        elif 'http:' in rss_url or 'https:' in rss_url: feedurl = rss_url # Proper rss feed. Use feedparser to get the data
            
        else: feedurl = f"https://news.google.com/rss/search?q=allinurl:{rss_url}+when:{hrsTime}h&ceid=IN:en&hl=en-IN&gl=IN" # Use Google News url (https://newscatcherapi.com/blog/google-news-rss-search-parameters-the-missing-documentaiton)
        print(feedurl)   
        try: 
            print('trying')
            rss_feed = feedparser.parse(feedurl) # Proper rss feed. Use feedparser to get the data
            print('done')
        except: print('Unable to get rss feed from', rss_url)
        
        if 'oauth.reddit.com' not in rss_url and rss_feed.status == 200: 
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
                        if 'title' in entry: 
                            entry_dict['title'] = re.sub(r'https?://\S+', '', entry['title'].replace('`', ''))
                            if '- Swarajya' in entry_dict['title']: entry_dict['title'] = re.sub(r'https?://\S+', '', entry['title'].replace('`', '')).split('- Swarajya')[0].strip()
                            elif '- CNN International' in entry_dict['title']: entry_dict['title'] = re.sub(r'https?://\S+', '', entry['title'].replace('`', '')).split('- CNN International')[0].strip()
                            if tts_text == f'New catgeory started. {rss_category}.': tts_text += f'New article. {entry_dict["title"]}'
                            else: tts_text = f'New article. {entry_dict["title"]}'
                        else: entry_dict['title'] = 'None'
                        if 'summary' in entry: 
                            entry_dict['summary'] = re.sub(r'<.*?>', '', re.sub(r'https?://\S+', '', entry['summary'].replace('`', '')))
                            if 'Swarajya' in entry_dict['summary']: entry_dict['summary'] = re.sub(r'https?://\S+', '', entry['summary'].replace('`', '')).split('Swarajya')[0].strip()
                            elif 'CNN International' in entry_dict['summary']: entry_dict['summary'] = re.sub(r'https?://\S+', '', entry['summary'].replace('`', '')).split('CNN International')[0].strip()
                            summ_len = len(entry_dict['summary'].split(' '))
                            if summ_len > 45: entry_dict['summary'] = ' '.join(entry_dict['summary'].split(' ')[:45]) + '...'
                            tts_text += f'{entry_dict["summary"]}'
                        else: entry_dict['summary'] = 'None'
                        if 'link' in entry: 
                            entry_dict['link'] = entry['link']
                            if 'newatlas' in entry_dict['link']: entry_dict['summary'] = entry_dict['summary'].split('Continue Reading')[0].strip()
                            elif 'warisboring' in entry_dict['link']: entry_dict['summary'] = entry_dict['summary'].split('The post')[0].strip()
                        else: entry_dict['link'] = 'None'
                        entry_dict['published_js'] = time.strftime('%Y-%m-%d', entry['published_parsed'])
                        if 'author' in entry: 
                            entry_dict['author'] = entry['author']
                            tts_text += f'Article by {entry_dict["author"]}'
                        else: entry_dict['author'] = 'None'
                        if entry['title'] not in all_titles:
                            all_titles.append(entry['title'])
                            if '::' in rss_url_full: # Apply filters
                                if eval(rss_url_full.split('::')[1]): rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)
                            else: rss2json[rss_category_renamed][rss_url]['entries'].append(entry_dict)

                # print('Doing tts')
                # audio = model.apply_tts(text=tts_text, speaker=speaker, sample_rate=sample_rate, put_accent=put_accent, put_yo=put_yo)
                # print('TTS complete. Adding to audios list')
                # all_audios.append(audio.data)
                # break

            print(len(rss2json[rss_category_renamed][rss_url]['entries']))
        
        else: print(rss_url, 'not available')
    
with open('rss2json.js', 'w') as f: # Dump json into file
    print('Writing JSON to file')
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use

# print('Starting audio object concatenation')
# audio_array = np.concatenate((all_audios)) 
# print('Finished audio object concatenation')

# audio_obj = Audio(data=audio_array, rate=sample_rate)
# with open('output.mp3', 'wb') as f: f.write(audio_obj.data)
# print('File saved')
    

