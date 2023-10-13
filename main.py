import feedparser, re, time, json
import torch
from omegaconf import OmegaConf
from IPython.display import Audio, display

print('Loading Silero models')

torch.hub.download_url_to_file('https://raw.githubusercontent.com/snakers4/silero-models/master/models.yml', 'latest_silero_models.yml', progress=False)
models = OmegaConf.load('latest_silero_models.yml')
print('Downloaded YAML of Silero models')


language = 'en'
model_id = 'v3_en'
device = torch.device('cpu')
model, example_text = torch.hub.load(repo_or_dir='snakers4/silero-models', model='silero_tts', language=language, speaker=model_id)
model.to(device)  # gpu or cpu

print('Loaded Silero models. Configuring voice')

sample_rate = 24000
speaker = "en_24"
put_accent=False
put_yo=False
example_text = 'Tom Brady. New blood test more convenient for measuring important omega-3 levels'

audio = model.apply_tts(text=example_text, speaker=speaker, sample_rate=sample_rate, put_accent=put_accent, put_yo=put_yo)
audio_obj = Audio(audio, rate=sample_rate)
with open('output.mp3', 'wb') as f: f.write(audio_obj.data)

print('Example output.mp3 done.')

all_audios = []

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
                        if 'title' in entry: 
                            entry_dict['title'] = entry['title']
                            if tts_text == f'New catgeory started. {rss_category}.': tts_text += f'New article. {entry_dict["title"]}'
                            else: tts_text = f'New article. {entry_dict["title"]}'
                        else: entry_dict['title'] = 'None'
                        if 'summary' in entry: 
                            entry_dict['summary'] = re.sub(r'<.*?>', '', entry['summary'])
                            tts_text += f'{entry_dict["summary"]}'
                        else: entry_dict['summary'] = 'None'
                        if 'link' in entry: entry_dict['link'] = entry['link']
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

                print('Doing tts')
                audio = model.apply_tts(text=tts_text, speaker=speaker, sample_rate=sample_rate, put_accent=put_accent, put_yo=put_yo)
                print('TTS complete. Addinf to audios list')
                audio_obj = Audio(audio, rate=sample_rate)
                all_audios.append(audio_obj)

            print(len(rss2json[rss_category_renamed][rss_url]['entries']))
        
        else: print(rss_url, 'not available')
    
with open('rss2json.js', 'w') as f: # Dump json into file
    print('Writing JSON to file')
    f.write(f'const rss2json = {json.dumps(rss2json)};') # Write to a file that Javascript can use

print('Starting audio object concatenation')
audio_array = all_audios[0].data
for aobj in all_audios[1:]:
    data = aobj.data
    audio_array = np.concatenate((audio_array, data)) 

print('Finished audio object concatenation')

with open('output.mp3', 'wb') as f: f.write(audio_array.data)
print('File saved')
    

