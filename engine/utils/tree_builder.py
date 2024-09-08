from .best_split_generator import best_split

class TreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature  # Feature name to split on
        self.threshold = threshold  # Value to compare the feature against
        self.left = left  # Left child
        self.right = right  # Right child
        self.value = value  # Class label if it's a leaf node

def build_tree(df, depth=0, max_depth=10):
    labels = df.iloc[:, -1]  # Extract the labels from the last column
    
    # Stopping criteria
    if len(labels.unique()) == 1:  # If all the labels are the same
        return TreeNode(value=labels.iloc[0])
    
    if depth >= max_depth:  # If maximum depth is reached
        most_common_label = labels.value_counts().idxmax()
        return TreeNode(value=most_common_label)
    
    # Find the best split
    feature, threshold, splits = best_split(df)
    
    if not splits:
        most_common_label = labels.value_counts().idxmax()
        return TreeNode(value=most_common_label)
    
    left_split, right_split = splits
    left_child = build_tree(left_split, depth + 1, max_depth)
    right_child = build_tree(right_split, depth + 1, max_depth)
    
    return TreeNode(feature=feature, threshold=threshold, left=left_child, right=right_child)