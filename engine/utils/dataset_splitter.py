def split_dataset(df, feature, threshold):
    left_split = df[df[feature] <= threshold]
    right_split = df[df[feature] > threshold]
    
    return left_split, right_split