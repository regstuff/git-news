# ntfyed

Configurable RSS/News reader with per-url include/exclude rules

# Options
All settings reside in config.json

1. *maxPublishTime:* How far back in time do you want pull stories from in all RSS feeds

2. *maxDescLen:* Length of the description that comes under the title in each card

3. *excludeTerms:* If these terms appear in the item title, item will be excluded. Applies to all feeds.

4. *includeTerms:* Like above, but terms to include - to be used to override the above exclusions in some cases

5. *rssurl:* A dictionary with categories as keys, and a list of feed urls as the value.

- To filter out items specific to each feed, add a :: after the url, followed by a python logical expression. If the expression evaluates to true, the item will be included. 

- Feedparser item syntax is to be used in the expression. These include entry["title"], entry["author"], entry["link"] & entry["summary"] (for description or full content). For tags, feedparser includes them in a list called term, within a dict named tags. So the expression should be like: all([x not in [y["term"] for y in entry["tags"]] for x in ["Apple"]]) 

- For sites that do not have RSS, check if Google News indexes them. Then you can use Google News' [site-specific RSS feed](https://newscatcherapi.com/blog/google-news-rss-search-parameters-the-missing-documentaiton) for these. Simply specify the site name without http(s)://. ntfyed will manage the rest.
