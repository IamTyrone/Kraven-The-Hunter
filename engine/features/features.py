import pandas as pd


class Cleaner:

    def __init__(self, data_path):
        self.data_path = data_path

    def digit_quantity(self, string: str) -> int:
        digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        counter = 0

        for value in string:
            if value in digits:
                counter += 1

        return counter


    def add_features(self):
        df = pd.read_csv(self.data_path)

        for index, row in df.iterrows():
            df["url_length"] = len(row["url"])
            df["verdict"] = 1 if row["label"] == "bad" else 0
            df["digit_quantity"] = self.digit_quantity(row["url"])

                 


cleaner = Cleaner(data_path="./data/Malware.csv")
cleaner.add_features()