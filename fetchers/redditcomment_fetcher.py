import urllib2
import json
import time
import pymysql.cursors
from collections import Counter

#MySql Connection
con = pymysql.connect(host ='', user='', password='', db='', charset="")


#Reddit Connection
hdr = {'User-Agent': '...)'}

cur = con.cursor(pymysql.cursors.DictCursor)
sql = "Insert here the select query to collect all Post_IDs we want to fetch the comments from"
cur.execute(sql)
for b in cur:
    try:
        link = b['pID']
        url = 'https://www.reddit.com/r/gameofthrones/comments/%s/.json' % link
        req = urllib2.Request(url, headers=hdr)
        text_data = urllib2.urlopen(req).read()
        data = json.loads(text_data)
        data_all = data[1].values()[1]['children']


        while (i < len(data_all)):
            parent = data_all[i]['data']['parent_id'][2:]
            if (data_all[i]['data']['replies']):
                for k in range(0, len(data_all[i]['data']['replies']['data']['children'])):

                    try:
                        with con.cursor() as cursor:
                            sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                            data = (data_all[i]['data']['replies']['data']['children'][k]['data']['id'],
                                    parent,
                                    data_all[i]['data']['replies']['data']['children'][k]['data']['body'],
                                    data_all[i]['data']['replies']['data']['children'][k]['data']['ups'],
                                    time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data_all[i]['data']['replies']['data']['children'][k]['data']['created_utc'])))
                            cursor.execute(sql, data)
                            con.commit()

                            if (data_all[i]['data']['replies']['data']['children'][k]['data']['replies']):
                                for l in range(0, len(data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'])):

                                    try:
                                        with con.cursor() as cursor:
                                            sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                                            data = (data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'][l]['data']['id'],
                                                    parent,
                                                    data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'][l]['data']['body'],
                                                    data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'][l]['data']['ups'],
                                                    time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(
                                                        data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'][l]['data'][
                                                            'created_utc'])))
                                            cursor.execute(sql, data)
                                            con.commit()

                                            if (data_all[i]['data']['replies']['data']['children'][k]['data']['replies']['data']['children'][l]['data']['replies']):
                                                for m in range(0, len(
                                                        data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                            'replies']['data']['children'][l]['data'][
                                                            'replies']['data']['children'])):

                                                    try:
                                                        with con.cursor() as cursor:
                                                            sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                                                            data = (
                                                            data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                                'replies']['data']['children'][l]['data'][
                                                                'replies']['data']['children'][m]['data']['id'],
                                                            parent,
                                                            data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                                'replies']['data']['children'][l]['data'][
                                                                'replies']['data']['children'][m]['data']['body'],
                                                            data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                                'replies']['data']['children'][l]['data'][
                                                                'replies']['data']['children'][m]['data']['ups'],
                                                            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(
                                                                data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                                    'replies']['data']['children'][l]['data'][
                                                                'replies']['data']['children'][m]['data'][
                                                                    'created_utc'])))
                                                            cursor.execute(sql, data)
                                                            con.commit()

                                                            if (data_all[i]['data']['replies']['data']['children'][k]['data'][
                                                                    'replies']['data']['children'][l]['data']['replies']['data']['children'][m]['data']['replies']):
                                                                for n in range(0, len(
                                                                        data_all[i]['data']['replies']['data']['children'][k][
                                                                            'data'][
                                                                            'replies']['data']['children'][l]['data'][
                                                                            'replies']['data']['children'][m]['data'][
                                                                            'replies']['data']['children'])):

                                                                    try:
                                                                        with con.cursor() as cursor:
                                                                            sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                                                                            data = (
                                                                                data_all[i]['data']['replies']['data'][
                                                                                    'children'][k]['data'][
                                                                                    'replies']['data']['children'][l]['data'][
                                                                                    'replies']['data']['children'][m]['data'][
                                                                                    'replies']['data']['children'][n]['data'][
                                                                                    'id'],
                                                                                parent,
                                                                                data_all[i]['data']['replies']['data'][
                                                                                    'children'][k]['data'][
                                                                                    'replies']['data']['children'][l]['data'][
                                                                                    'replies']['data']['children'][m]['data'][
                                                                                    'replies']['data']['children'][n]['data'][
                                                                                    'body'],
                                                                                data_all[i]['data']['replies']['data'][
                                                                                    'children'][k]['data'][
                                                                                    'replies']['data']['children'][l]['data'][
                                                                                    'replies']['data']['children'][m]['data'][
                                                                                    'replies']['data']['children'][n]['data'][
                                                                                    'ups'],
                                                                                time.strftime('%Y-%m-%d %H:%M:%S',
                                                                                              time.localtime(
                                                                                                  data_all[i]['data'][
                                                                                                      'replies']['data'][
                                                                                                      'children'][k]['data'][
                                                                                                      'replies']['data'][
                                                                                                      'children'][l]['data'][
                                                                                                      'replies']['data'][
                                                                                                      'children'][m]['data'][
                                                                                    'replies']['data']['children'][n]['data'][
                                                                                                      'created_utc'])))
                                                                            cursor.execute(sql, data)
                                                                            con.commit()

                                                                            if (data_all[i]['data']['replies']['data'][
                                                                                    'children'][k]['data'][
                                                                                    'replies']['data']['children'][l][
                                                                                    'data']['replies']['data'][
                                                                                    'children'][m]['data']['replies']['data'][
                                                                                    'children'][n]['data']['replies']):
                                                                                for o in range(0, len(
                                                                                        data_all[i]['data']['replies'][
                                                                                            'data']['children'][k][
                                                                                            'data'][
                                                                                            'replies']['data'][
                                                                                            'children'][l]['data'][
                                                                                            'replies']['data'][
                                                                                            'children'][m]['data'][
                                                                                            'replies']['data'][
                                                                                            'children'][n]['data'][
                                                                                            'replies']['data'][
                                                                                            'children'])):

                                                                                    try:
                                                                                        with con.cursor() as cursor:
                                                                                            sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                                                                                            data = (
                                                                                                data_all[i]['data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][k][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][l][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][m][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][n][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][o]['data'][
                                                                                                    'id'],
                                                                                                parent,
                                                                                                data_all[i]['data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][k][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][l][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][m][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][n][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][o]['data'][
                                                                                                    'body'],
                                                                                                data_all[i]['data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][k][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][l][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][m][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][n][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][o]['data'][
                                                                                                    'ups'],
                                                                                                time.strftime(
                                                                                                    '%Y-%m-%d %H:%M:%S',
                                                                                                    time.localtime(
                                                                                                        data_all[i][
                                                                                                            'data'][
                                                                                                            'replies'][
                                                                                                            'data'][
                                                                                                            'children'][
                                                                                                            k]['data'][
                                                                                                            'replies'][
                                                                                                            'data'][
                                                                                                            'children'][
                                                                                                            l]['data'][
                                                                                                            'replies'][
                                                                                                            'data'][
                                                                                                            'children'][
                                                                                                            m]['data'][
                                                                                                            'replies'][
                                                                                                            'data'][
                                                                                                            'children'][
                                                                                                            n][
                                                                                                    'data'][
                                                                                                    'replies']['data'][
                                                                                                    'children'][o]['data'][
                                                                                                            'created_utc'])))
                                                                                            cursor.execute(sql, data)
                                                                                            con.commit()

                                                                                    finally:
                                                                                        con.close()
                                                                    finally:
                                                                        con.close()




                                                    finally:
                                                        con.close()


                                    finally:
                                        con.close()
                    finally:
                        con.close()

            try:
                with con.cursor() as cursor:
                    sql = "INSERT INTO RedditComments2 (commentID, parentID, content, score, commentedOnDate) VALUES (%s, %s, %s, %s, %s);"
                    data = (data_all[i]['data']['id'],
                            data_all[i]['data']['parent_id'][2:],
                            data_all[i]['data']['body'],
                            data_all[i]['data']['ups'],
                            time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(data_all[i]['data']['created_utc'])))
                    cursor.execute(sql, data)
                    con.commit()
            finally:
                con.close()
            i = i+1
    except KeyError:
        continue



