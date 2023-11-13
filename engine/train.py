import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import  classification_report
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, ExtraTreesClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import SGDClassifier, LogisticRegression
from sklearn.naive_bayes import GaussianNB
import joblib
from features.features import Cleaner

def train():
    #spliting the dataset
    cleaner = Cleaner(data_path="features/data/Malware.csv")

    df = cleaner.add_features()

    print("----------------------> Starting ML Learning process <--------------------\n")

    x = df.drop(['url','label','verdict'], axis=1)
    y = df['verdict']

    #train = 80% test = 20%
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=2)

    #training models
    models = [LogisticRegression, DecisionTreeClassifier,RandomForestClassifier,AdaBoostClassifier,KNeighborsClassifier,SGDClassifier,ExtraTreesClassifier,GaussianNB]
    model_name = ["logistic_regression", "decision_tree_classifier", "random_forest_classifier", "ada_boost_classifier", "kneighbors_classifier", "sgd_classifier", "extra_trees_classifier", "gaussian_classifier"]
    # Initialize a list to store the classification reports
    classification_reports = []

    for index, model_class in enumerate(models):
        print(f"----------------------------> {model_class} <----------------------------")
        
        # Create an instance of the model
        model = model_class()
        
        # Train the model
        model.fit(x_train, y_train)
        
        # Make predictions
        y_pred = model.predict(x_test)
        
        # Calculate and store the classification report
        report = classification_report(y_test, y_pred, target_names=['benign', 'malicious'])
        classification_reports.append(report)
        
        # Print the classification report
        print('\033[01m Classification Report \033[0m')
        print(report)
        file = "models/" + model_name[index]+".pkl"
        joblib.dump(model, file)


    #final report
    output = pd.DataFrame({"Model": ['Logistic Regression Classifier','Decision Tree Classifier', 'Random Forest Classifier', 'AdaBoost Classifier', 'KNeighbors Classifier', 'SGD Classifier', 'Extra Trees Classifier', 'Gaussian NB'], "Classification Report": classification_reports})

    print(output)

