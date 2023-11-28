#importing all of our needed libraries
import numpy as np
from pandas import read_csv
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from sklearn.preprocessing import LabelEncoder

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

#need to convert duration to integer value
for j in range(X_D.shape[0]):
    m, s = X_D[j][2].split(':')
    secs = (int(m) * 60) + int(s)
    X_D[j][2] = secs

#storing results in new files
with open("first_iter/first_iter_metrics", "w") as f:
    f.write(" ")
with open("second_iter/second_iter_metrics", "w") as f:
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
    print('Accuracy Score: ' + str(round(accuracy, 3)))
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

"""the following code sets up all of our models with duration feature"""
second_iter = [] #array to store our models
second_iter.append(('Gaussian_NB', GaussianNB(), "second_iter/gaussian_nb_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('kNN', KNeighborsClassifier(), "second_iter/knn_predictions", "second_iter/second_iter_metrics", X_D, y_D))
second_iter.append(('LDA', LinearDiscriminantAnalysis(), "second_iter/lda_predictions", "second_iter/second_iter_metrics", X_D, y_D))

"""the following code runs our models"""
for name, model, file_pred, file_metrics, X, y in first_iter: #looping through our model array
    classifier(name, model, file_pred, file_metrics, X, y) #calling the template classifier function to run all models
#
for name, model, file_pred, file_metrics, X, y in second_iter: #looping through our model array
    classifier(name, model, file_pred, file_metrics, X, y) #calling the template classifier function to run all models


