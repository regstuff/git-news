# git-news

Configurable RSS/News reader - kind of midway between Google News and a traditional RSS reader. 

[Demo](https://regstuff.github.io/git-news/)

# Features
- Show feed items published only in the past x days/hours/minutes
- Universal & per-url include/exclude rules
- Create feed categories 

# Install
- [Fork this repository](https://github.com/regstuff/git-news/fork)
- [Set up Github Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) for your repo. Wait 5 minutes for Github to make your page live. 
- Visit https://[Your Username].github.io/git-news/

# Options
All settings reside in config.js as a JSON blob, except for the frequency of feed updates. That can be changed in the Cron schedule in main.yml.

1. *maxPublishTime:* How far back in time do you want pull stories from in all RSS feeds

2. *maxDescLen:* Length of the description that comes under the title in each card

3. *excludeTerms:* If these terms appear in the item title, item will be excluded. Applies to all feeds.

4. *includeTerms:* Like above, but terms to include - to be used to override the above exclusions in some cases

5. *rssurl:* A dictionary with categories as keys, and a list of feed urls as the value.

- To filter out items specific to each feed, add a :: after the url, followed by a python logical expression. If the expression evaluates to true, the item will be included. 

- [Feedparser item syntax](https://feedparser.readthedocs.io/en/latest/common-rss-elements.html) is to be used in the expression. These include entry["title"], entry["author"], entry["link"] & entry["summary"] (for description or full content). For tags, feedparser includes them in a list called term, within a dict named tags. So the expression should be like: all([x not in [y["term"] for y in entry["tags"]] for x in ["Apple"]]) 

- For sites that do not have RSS, check if Google News indexes them. Then you can use Google News' [site-specific RSS feed](https://newscatcherapi.com/blog/google-news-rss-search-parameters-the-missing-documentaiton) for these. Simply specify the site name without http(s)://. git-news will manage the rest.

# How it works
Github actions are scheduled via Cron to use feedparser to parse each url. The parsed output is dumped as json in rss2json. Front-end Javascript on Github Pages does the rest.

# To-Do
- Merge items on the same story published in multiple sites, like how Google News gives a dropdown below the main item
- AI-based topic-level filtering. Eg. Filter out all smartphone news, even when the word 'smartphone' is not used
- Save feed items & search/list those later
