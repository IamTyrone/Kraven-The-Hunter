import pandas as pd


class Cleaner:

    def __init__(self, data_path):
        self.data_path = data_path

    def digit_quantity(self, string: str) -> int:
        digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        counter = 0

        for value in iter(string):
            if value in digits:
                counter += 1

        return counter
    
    def special_character_count(self, string: str) -> int:
        special_chars = ['@','?','-','=','#','%','+','$','!','*',',','//', '.']
        count = 0

        for char in iter(string):
            if char in special_chars:
                count += 1

        return count
    
    def shortining_service(self, url):
        shorteners_list = ['bit.ly','goo.gl','shorte.st','go2l.ink','x.co','ow.ly','t.co','tinyurl','tr.im','is.gd','cli.gs',
                        'yfrog.com','migre.me','ff.im','tiny.cc','url4.eu','twit.ac','su.pr','twurl.nl','snipurl.com',
                        'short.to','BudURL.com','ping.fm','post.ly','Just.as','bkite.com','snipr.com','fic.kr','loopt.us',
                        'doiop.com','short.ie','kl.am','wp.me','rubyurl.com','om.ly','to.ly','bit.do','t.co','lnkd.in',
                        'db.tt','qr.ae','adf.ly','goo.gl','bitly.com','cur.lv','tinyurl.com','ow.ly','bit.ly','ity.im',
                        'q.gs','is.gd','po.st','bc.vc','twitthis.com','u.to','j.mp','buzurl.com','cutt.us','u.bb','yourls.org',
                        'x.co','prettylinkpro.com','scrnch.me','filoops.info','vzturl.com','qr.net','1url.com','tweez.me','v.gd',
                        'tr.im','link.zip.net']
        for value in shorteners_list:
            if value in url:
                return 1
            else:
                return 0


    def add_features(self):

        df = pd.read_csv(self.data_path)
        url_length = []
        verdict = []
        digit_quantity = []
        numerical_percantage = []
        special_character_count = []
        special_character_percantge = []
        has_shortining_service = []
        good_or_bad = []
        url = []
        

        for index, row in df.iterrows():
            url.append(row["url"])
            url_length.append(len(row["url"]))
            verdict_value = 1 if row["label"] == "bad" else 0
            verdict.append(verdict_value)
            digit_quantity.append(self.digit_quantity(row["url"]))
            numerical_percantage.append(self.digit_quantity(row["url"])/len(row["url"]))
            special_character_count.append(self.special_character_count(row["url"]))
            special_character_percantge.append(self.special_character_count(row["url"])/len(row["url"]))
            has_shortining_service.append(self.shortining_service(row["url"]))
            good_or_bad.append(row["label"])

        df["url_length"] = url_length
        df["digit_quantity"] = digit_quantity
        df["numerical_percantage"] = numerical_percantage
        df["special_character_count"] = special_character_count
        df["special_character_percantge"] = special_character_percantge
        df["has_shortining_service"] = has_shortining_service
        df["verdict"] = verdict
        df["label"] = good_or_bad
        df["url"] = url

        return df