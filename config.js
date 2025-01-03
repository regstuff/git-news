const config = {
    'maxPublishTime': 1*24*60, // In minutes
    'maxDescLen': 400, // Max number of characters
    'excludeTerms': ['Black Friday', 'Cyber Monday', 'NEET', 'Pee-Gate', 'pee-gate', 'pee gate', 'Pee Gate', 'Bharat Jodo', 'monkeypox', 'covid', 'COVID', 'corona', 'Moosewala', 'Nupur Sharma', 'Morbi', 'Aftab', 'Shraddha', 'Moose Wala', 'iTunes', 'iPhone', 'iPad', 'smartwatch', 'iOS', 'Watch', 'macOS', 'watchOS', 'Prime Day', 'Garmin', 'Amazfit', 'Fitbit', 'Google Pixel', 'Pixel 6', 'Pixel 7', 'Sex Toy'], // Exclude any titles with these terms. Case-sensitive
    'includeTerms': [], // Include any titles with these terms. Overrides exclude terms. Case-sensitive
    'rssurl': {'Scitech': ['https://newatlas.com/science/index.rss', 'https://www.cbsnews.com/latest/rss/science', 'https://www.cbsnews.com/latest/rss/space', 'http://warisboring.com/feed/'],
    'Gadgets': ['https://www.emergentmind.com/feeds/rss'], // 'https://www.xda-developers.com/feed/::not any([x in entry["title"] for x in ["Moto ", "Honor", "Zenfone", "Zen fone", "Oppo", "Vivo", "POCO", "Poco", "OnePlus", "Nothing Phone", "Redmi", "MIUI", "Xperia"]]) and not ("Samsung" in entry["title"] and "Galaxy" in entry["title"]) and not ("Xiaomi" in entry["title"] and ("smartphone" in entry["title"] or "Smartphone" in entry["title"]))'],// 'https://www.wired.com/feed/category/gear/latest/rss', 'https://www.notebookcheck.net/RSS-Feed-Notebook-Reviews.8156.0.html::all([x not in entry["title"] for x in ["Moto ", "Honor", "iPhone", "Oppo", "Vivo", "POCO", "Poco", "OnePlus", "Nothing Phone", "Redmi", "MIUI", "Xperia", "Zenfone", "Zen fone"]]) and not ("Samsung" in entry["title"] and "Galaxy" in entry["title"]) and not (("Xiaomi" in entry["title"] or "Realme" in entry["title"] or "realme" in entry["title"]) and ("smartphone" in entry["title"] or "Smartphone" in entry["title"]))', 'https://www.notebookcheck.net/News.152.100.html::all([x not in entry["title"] for x in ["Moto ", "Honor", "iPhone", "Oppo", "Vivo", "POCO", "Poco", "OnePlus", "Nothing Phone", "Redmi", "MIUI", "Xperia", "Zenfone", "Zen fone"]]) and not ("Samsung" in entry["title"] and "Galaxy" in entry["title"]) and not (("Xiaomi" in entry["title"] or "Realme" in entry["title"] or "realme" in entry["title"]) and ("smartphone" in entry["title"] or "Smartphone" in entry["title"]))', 'http://feeds.feedburner.com/DiscoverTechnology'],    
    'Food/Health': ['https://phys.org/rss-feed/biology-news/agriculture/'], //'https://www.science.org/rss/news_current.xml', 
    'Nature': ['http://feeds.feedburner.com/DiscoverLivingWorld', 'http://feeds.feedburner.com/DiscoverEnvironment',],
    'Business': [],//['https://www.wired.com/feed/category/business/latest/rss', 'https://www.economist.com/finance-and-economics/rss.xml', ],
    'Foss/Self-hosting': [],// 'https://rss.beehiiv.com/feeds/iiTciQgHPG.xml'],
    'History': ['https://phys.org/rss-feed/science-news/archaeology-fossils'],
    'News': ['https://indianexpress.com/print/front-page/feed/', 'swarajyamag.com::all([x not in entry["link"] for x in ["/movies/", "/newsletters/"]])'], // 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',            
    'Reddit': ['https://oauth.reddit.com/r/todayilearned/top', 'https://oauth.reddit.com/.json'],
    'Sport':[],
    },
};
