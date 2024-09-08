from .entropy_calculator import entropy

def information_gain(df, split_data, base_entropy):
    total_len = len(df)
    
    # Weighted entropy of the splits
    weighted_entropy = sum((len(subset) / total_len) * entropy(subset) for subset in split_data)
    
    # Information gain
    return base_entropy - weighted_entropy