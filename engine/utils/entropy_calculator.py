import pandas as pd
import math
# from collections import Counter

def entropy(df):
    labels = df.iloc[:, -1]  # Assume the last column is the label
    label_counts = labels.value_counts()
    total_count = len(labels)
    
    init_entropy = 0.0
    for count in label_counts:
        prob = count / total_count
        init_entropy -= prob * math.log2(prob)  # Calculate the entropy
    
    return init_entropy