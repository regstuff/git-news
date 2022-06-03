const config = {
    'maxPublishTime': 1*24*3600*1000, // 1 day in milliseconds
    'maxDescLen': 200, // Max number of characters
    'excludeTerms': ['Reactors',], // Exclude any titles with these terms. Case-sensitive
    'includeTerms': ['Reactors',], // Include any titles with these terms. Overrides exclude terms. Case-sensitive
    'rssurl': {'Scitech': ['https://www.wired.com/feed/tag/ai/latest/rss', 'https://www.wired.com/feed/category/science/latest/rss', 'https://www.wired.com/feed/category/security/latest/rss', 'https://www.newscientist.com/subject/physics/feed/', 'https://www.newscientist.com/subject/technology/feed/', 'https://www.newscientist.com/subject/space/feed/'],
    'Nature': ['https://www.newscientist.com/subject/earth/feed/', 'https://www.newscientist.com/subject/life/feed/', 'https://www.newscientist.com/subject/humans/feed/'],
    'Longform': ['https://www.newscientist.com/section/features/feed/', 'https://www.wired.com/feed/category/ideas/latest/rss', 'https://www.wired.com/feed/tag/wired-guide/latest/rss', 'https://www.wired.com/feed/category/backchannel/latest/rss'],
    'Health': ['https://www.newscientist.com/subject/health/feed/',],
    },
};