import pandas as pd
import math
import re
from urllib.parse import urlparse
from collections import Counter


SHORTENERS = {
    'bit.ly', 'goo.gl', 'shorte.st', 'go2l.ink', 'x.co', 'ow.ly', 't.co',
    'tinyurl', 'tr.im', 'is.gd', 'cli.gs', 'yfrog.com', 'migre.me', 'ff.im',
    'tiny.cc', 'url4.eu', 'twit.ac', 'su.pr', 'twurl.nl', 'snipurl.com',
    'short.to', 'budurl.com', 'ping.fm', 'post.ly', 'just.as', 'bkite.com',
    'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'short.ie', 'kl.am',
    'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do', 'lnkd.in', 'db.tt',
    'qr.ae', 'adf.ly', 'bitly.com', 'cur.lv', 'tinyurl.com', 'ity.im',
    'q.gs', 'po.st', 'bc.vc', 'twitthis.com', 'u.to', 'j.mp', 'buzurl.com',
    'cutt.us', 'u.bb', 'yourls.org', 'prettylinkpro.com', 'scrnch.me',
    'filoops.info', 'vzturl.com', 'qr.net', '1url.com', 'tweez.me', 'v.gd',
    'link.zip.net',
}

IP_PATTERN = re.compile(
    r'^(?:\d{1,3}\.){3}\d{1,3}$'
)


class Cleaner:

    def __init__(self, data_path):
        self.data_path = data_path

    def digit_quantity(self, string: str) -> int:
        return sum(c.isdigit() for c in string)

    def special_character_count(self, string: str) -> int:
        special_chars = set('@?-=#%+$!*,.')
        return sum(c in special_chars for c in string)

    def shortining_service(self, url):
        url_lower = url.lower()
        for shortener in SHORTENERS:
            if shortener in url_lower:
                return 1
        return 0

    def add_features(self):
        df = pd.read_csv(self.data_path)
        features = df["url"].apply(extract_features)
        features_df = pd.DataFrame(features.tolist())

        for col in features_df.columns:
            df[col] = features_df[col]

        df["verdict"] = df["label"].apply(lambda x: 1 if x == "bad" else 0)
        return df


def _shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    counts = Counter(s)
    length = len(s)
    return -sum((c / length) * math.log2(c / length) for c in counts.values())


def _parse_url_safe(url: str):
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    try:
        return urlparse(url)
    except ValueError:
        return urlparse("")


def extract_features(url: str) -> dict:
    parsed = _parse_url_safe(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""

    url_len = len(url)
    digit_count = sum(c.isdigit() for c in url)
    special_chars = set('@?-=#%+$!*,.')
    spec_count = sum(c in special_chars for c in url)

    url_lower = url.lower()
    has_shortener = 0
    for s in SHORTENERS:
        if s in url_lower:
            has_shortener = 1
            break

    # New features
    url_entropy = _shannon_entropy(url)
    has_ip = 1 if IP_PATTERN.match(hostname) else 0
    subdomain_count = max(hostname.count('.') - 1, 0) if hostname else 0
    path_depth = len([seg for seg in path.split('/') if seg])
    has_at_symbol = 1 if '@' in url else 0
    has_double_slash = 1 if '//' in path else 0
    domain_length = len(hostname)
    is_https = 1 if parsed.scheme == 'https' else 0

    return {
        "url_length": url_len,
        "digit_quantity": digit_count,
        "numerical_percantage": digit_count / url_len if url_len else 0,
        "special_character_count": spec_count,
        "special_character_percantge": spec_count / url_len if url_len else 0,
        "has_shortining_service": has_shortener,
        "url_entropy": url_entropy,
        "has_ip_address": has_ip,
        "subdomain_count": subdomain_count,
        "path_depth": path_depth,
        "has_at_symbol": has_at_symbol,
        "has_double_slash_redirect": has_double_slash,
        "domain_length": domain_length,
        "is_https": is_https,
    }