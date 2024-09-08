from .entropy_calculator import entropy
from .dataset_splitter import split_dataset
from .information_gain import information_gain

def best_split(df):
    base_entropy = entropy(df)
    best_gain = 0.0
    best_feature = None
    best_threshold = None
    best_splits = None
    
    features = df.columns[:-1]  # Exclude the label (assumed to be the last column)
    
    for feature in features:
        # Get all the values for the current feature
        unique_values = df[feature].unique()
        
        # Try each unique value as a threshold
        for threshold in unique_values:
            left_split, right_split = split_dataset(df, feature, threshold)
            
            if left_split.empty or right_split.empty:
                continue  # Skip if no split occurs
            
            gain = information_gain(df, [left_split, right_split], base_entropy)
            
            if gain > best_gain:
                best_gain = gain
                best_feature = feature
                best_threshold = threshold
                best_splits = (left_split, right_split)
    
    return best_feature, best_threshold, best_splits