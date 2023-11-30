#importing all of our needed libraries
import numpy as np
from pandas import read_csv
from sklearn import preprocessing
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import PolynomialFeatures
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from sklearn.preprocessing import LabelEncoder
import os

from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

# cwd = os.getcwd()
first_iter_path = "first_iter"
second_iter_path = "second_iter"
third_iter_path = "third_iter"

#checking if directories are created for each iteration
first_path_exists = os.path.exists(first_iter_path)
second_path_exists = os.path.exists(second_iter_path)
third_path_exists = os.path.exists(third_iter_path)
#creating directories if
if not first_path_exists:
   os.mkdir(first_iter_path)
if not second_path_exists:
    os.mkdir(second_iter_path)
if not third_path_exists:
    os.mkdir(third_iter_path)

#input file
url = "test_data.csv"

#columns of the input file
names = ['song', 'artist', 'acousticness', 'danceability', 'duration', 'energy', 'instrumentalness', 'key', 'liveness', 'loudness', 'speechiness', 'tempo', 'valence', 'genre']

#putting the data inside the input file into a dataframe with the columns being the columns from the csv file
dataset = read_csv(url, names=names, header=0)

#dataset dropping initially non-numeric values
dataset_noD = dataset.drop(columns=['song', 'artist', 'duration', 'key'])

#dataset using duration
dataset_D = dataset.drop(columns=['song', 'artist', 'key'])

#dataset using duration & key
dataset_DK = dataset.drop(columns=['song', 'artist'])
#mapping the 'key' column to integer values
le = LabelEncoder()
dataset_DK['key'] = le.fit_transform(dataset_DK['key'])

#storing the values from the dataset into a matrix, specifying with/without duration/key
array_noD = dataset_noD.values
array_D = dataset_D.values
array_DK = dataset_DK.values

#storing the features and classes in separate arrays
X_noD = array_noD[:, 0:9] #stores song features
y_noD = array_noD[:, 9] #stores the class of the song (movie genre)

""" below code is if you're using duration """
#storing the features and classes in separate arrays
X_D = array_D[:, 0:10] #stores song features
y_D = array_D[:, 10] #stores the class of the song (movie genre)

""" below code is if you're using duration & key """
#storing the features and classes in separate arrays
X_DK = array_DK[:, 0:11] #stores song features
y_DK = array_DK[:, 11] #stores the class of the song (movie genre)

#converting duration from minutes:seconds notation to strictly seconds
for j in range(X_D.shape[0]):
    m, s = X_D[j][2].split(':')
    secs = (int(m) * 60) + int(s)
    X_D[j][2] = secs

for j in range(X_DK.shape[0]):
    m, s = X_DK[j][2].split(':')
    secs = (int(m) * 60) + int(s)
    X_DK[j][2] = secs

#storing results in new files
with open("first_iter/first_iter_metrics", "w") as f:
    f.write(" ")
with open("second_iter/second_iter_metrics", "w") as f:
    f.write(" ")
with open("third_iter/third_iter_metrics", "w") as f:
    f.write(" ")

"""the following function will run models"""
def classifier(name, model, file_to_write_prediction, file_to_write_metrics, X, y):
    """the below block of code fits and transforms sets of data according to degree of regression"""
    X_Fold1, X_Fold2, y_Fold1, y_Fold2 = train_test_split(X, y, test_size=0.50, random_state=1)
    #using our first fold
    X_Poly1 = X_Fold1
    #using our second fold
    X_Poly2 = X_Fold2

    # training our first fold
    model.fit(X_Poly1, y_Fold1)

    pred1 = model.predict(X_Fold2)  # testing/predicting for fold 1; no need to map values

    #training our second fold
    model.fit(X_Poly2, y_Fold2)

    pred2 = model.predict(X_Fold1)  # testing/predicting for fold 2; no need to map values

    #storing our actual values
    actual = np.concatenate([y_Fold2, y_Fold1])
    #storing our tested/predicted values
    predicted = np.concatenate([pred1, pred2])

    #writing each prediction to file
    with open(file_to_write_prediction, "w") as f:
        for i in range(y.shape[0]):
            f.write(str(i+2) + ". " + str(predicted[i] + "\n")) #formatting it this way and indexing starting at 2 for easy comparison to our test data

    """The following block of code prints our output for the regression models"""
    #printing the name of the model before running it
    print('%s' %name)
    #calculating the accuracy score
    accuracy = accuracy_score(actual, predicted)
    #printing the accuracy score
    rounded_accuracy = str(round(accuracy, 3))
    print('Accuracy Score: ' + rounded_accuracy)
    #printing the string 'Confusion Matrix: '
    print('Confusion Matrix: ')
    #printing the calculated confusion matrix
    print(confusion_matrix(actual, predicted))
    #printing newline
    print("")

    #writing these results to file
    with open(file_to_write_metrics, "a") as f:
        f.write("\n")
        f.write('%s' %name)
        f.write('\nAccuracy Score: ' + str(round(accuracy, 3)))
        f.write('\nConfusion Matrix: ')
        f.write("\n")
        f.write(str(confusion_matrix(actual, predicted)))
        f.write("\n")

"""the following code sets up all of our models without duration feature"""
first_iter = [] #array to store our models
first_iter.append(('Gaussian_NB', GaussianNB(), "first_iter/gaussian_nb_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('kNN', KNeighborsClassifier(), "first_iter/knn_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('LDA', LinearDiscriminantAnalysis(), "first_iter/lda_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('SVM', LinearSVC(dual='auto', max_iter=1000), "first_iter/svm_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('Decision Tree', DecisionTreeClassifier(), "first_iter/decision_tree_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('Random Forest', RandomForestClassifier(), "first_iter/random_forest_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('Extra Trees', ExtraTreesClassifier(), "first_iter/extra_trees_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))
first_iter.append(('Neural Network', MLPClassifier(max_iter=10000), "first_iter/neural_network_predictions", "first_iter/first_iter_metrics", X_noD, y_noD))


"""the following code sets up all of our models with duration feature"""
second_iter = [] #array to store our models
second_iter.append(('Gaussian_NB', GaussianNB(), "second_iter/gaussian_nb_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('kNN', KNeighborsClassifier(), "second_iter/knn_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('LDA', LinearDiscriminantAnalysis(), "second_iter/lda_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('SVM', LinearSVC(dual='auto', max_iter=1000), "second_iter/svm_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('Decision Tree', DecisionTreeClassifier(), "second_iter/decision_tree_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('Random Forest', RandomForestClassifier(), "second_iter/random_forest_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('Extra Trees', ExtraTreesClassifier(), "second_iter/extra_trees_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('Neural Network', MLPClassifier(max_iter=10000), "second_iter/neural_network_predictions", "second_iter/second_iter_metrics", X_D, y_D))


"""the following code sets up all of our models including the duration and key features"""
third_iter = [] #array to store our models
third_iter.append(('Gaussian_NB', GaussianNB(), "third_iter/gaussian_nb_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('kNN', KNeighborsClassifier(), "third_iter/knn_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('LDA', LinearDiscriminantAnalysis(), "third_iter/lda_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('SVM', LinearSVC(dual='auto', max_iter=1000), "third_iter/svm_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('Decision Tree', DecisionTreeClassifier(), "third_iter/decision_tree_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('Random Forest', RandomForestClassifier(), "third_iter/random_forest_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('Extra Trees', ExtraTreesClassifier(), "third_iter/extra_trees_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))
third_iter.append(('Neural Network', MLPClassifier(max_iter=10000), "third_iter/neural_network_predictions", "third_iter/third_iter_metrics", X_DK, y_DK))


"""the following code runs our models"""
for name, model, file_pred, file_metrics, X, y in first_iter: #looping through our model array
    classifier(name, model, file_pred, file_metrics, X, y) #calling the template classifier function to run all models

for name, model, file_pred, file_metrics, X, y in second_iter: #looping through our model array
    classifier(name, model, file_pred, file_metrics, X, y) #calling the template classifier function to run all models

for name, model, file_pred, file_metrics, X, y in third_iter: #looping through our model array
    classifier(name, model, file_pred, file_metrics, X, y) #calling the template classifier function to run all models

