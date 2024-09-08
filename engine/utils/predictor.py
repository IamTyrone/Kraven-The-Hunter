def predict(tree, row):
    if tree.value is not None:
        return tree.value  # Leaf node
    
    if row[tree.feature] <= tree.threshold:
        return predict(tree.left, row)
    else:
        return predict(tree.right, row)