import urllib2
import json
import time
import pymysql.cursors


#MySql Connection
con = pymysql.connect(host ='', user='', password='', db='', charset="utf8mb4")


#Reddit Connection
hdr = {'User-Agent': '...'}
url = 'https://www.reddit.com/r/name of the series/new/.json?sort=new&t=all&limit=100'
req = urllib2.Request(url, headers=hdr)
text_data = urllib2.urlopen(req).read()

data = json.loads(text_data)
data_all = data.values()[1]['children']
count = 0
while (len(data_all) <= 800):
    time.sleep(2)
    last = data_all[-1]['data']['name']
    url = 'https://www.reddit.com/r/name of the series/new/.json?sort=new&t=all&limit=100&after=%s' % last
    req = urllib2.Request(url, headers=hdr)
    text_data = urllib2.urlopen(req).read()
    data = json.loads(text_data)
    data_all += data.values()[1]['children']
    count = count + 1
    lastdate = int(data_all[len(data_all)-1]['data']['created'])
newdate = lastdate - 15552000
while (newdate >= 1325451738):
    newdate = lastdate - 15552000
    last = ''
    iterate = 0
    while (iterate < 10):
        time.sleep(2)
        url = 'https://www.reddit.com/r/name of the series/search.json?sort=new&limit=100&q=timestamp%%3A%s..%s&restrict_sr=on&syntax=cloudsearch&after=%s' % (newdate, lastdate, last)
        req = urllib2.Request(url, headers=hdr)
        text_data = urllib2.urlopen(req).read()
        data = json.loads(text_data)
        length = len(data_all)
        data_all += data.values()[1]['children']
        length = len(data_all) - length
        if data_all[-1]['data']['name'] in last or length < 100:
            lastdate = int(data_all[len(data_all)-1]['data']['created'])
            break
        last = data_all[-1]['data']['name']
        iterate = iterate + 1	


for i in range(0, len(data_all)):
    if len(data_all[i]['data']['selftext']) > 14000:
        continue
    try:
        with con.cursor() as cursor:
            sql = "INSERT INTO RedditPosts (ID, postID, subreddit, title, isSpoiler, content, linkFlairText, numOfComments, score, over18, subredditType, numOfUpvotes, postedOnDate, url) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
            data = (data_all[i]['data']['id'],
                    i,
	    data_all[i]['data']['subreddit'],
	    data_all[i]['data']['title'], 
            data_all[i]['data']['spoiler'], 
            data_all[i]['data']['selftext'], 
            data_all[i]['data']['link_flair_text'], 
            data_all[i]['data']['num_comments'],
            data_all[i]['data']['score'], 
            data_all[i]['data']['over_18'], 
            data_all[i]['data']['subreddit_type'], 
            data_all[i]['data']['ups'], 
            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data_all[i]['data']['created_utc'])),
            data_all[i]['data']['url'])
            cursor.execute(sql, data)
            con.commit()
    finally:
       con.close()
