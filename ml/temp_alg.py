from pandas import read_csv
import random
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

low_tempo = ["Drama", "Romance"]
high_tempo = ["Musical", "Action", "Comedy", "Adventure"]
low_acousticness = ["Action", "Adventure", "Thriller", "Sci-Fi"]
high_acousticness = ["Romance", "History", "Family"]
low_danceability = ["Horror", "War", "Documentary", "Crime"]
high_danceability = ["Musical", "Family", "Sci-Fi", "Fantasy"]
low_energy = ["Romance", "Drama", "Mystery"]
high_energy = ["Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy"]
high_liveness = ["Documentary", "History", "Musical"]
low_loudness = ["Romance", "Family", "Mystery"]
high_loudness = ["War", "Action", "Horror"]
high_speechiness = ["Documentary", "History"]
low_valence = ["Horror", "War", "Drama", "Crime"]
high_valence = ["Comedy", "Romance", "Family"]

def produce_genre():
    # input file
    url = "single_test_data.csv"

    # columns of the input file
    names = ['tempo', 'danceability', 'acousticness', 'happiness', 'energy', 'speechiness', 'loudness','liveness']

    # putting the data inside the input file into a dataframe with the columns being the columns from the csv file
    dataset = read_csv(url, names=names, header=0)

    # storing the values from the dataset into a matrix, specifying with/without duration/key
    values = dataset.values
    array = values.flatten()

#     print(array)

    i=0
    low_chars = []
    high_chars = []
    for stat in array:
        if stat==1:
            low_chars.append(names[i])
        if stat==5:
            high_chars.append(names[i])
        i+=1
    if low_chars == [] and high_chars == []:
        j=0
        for stat in array:
            if stat == 2:
                low_chars.append(names[j])
            if stat == 4:
                high_chars.append(names[j])
            j += 1

#     print(low_chars)
#     print(high_chars)

    genres = []
    for char in low_chars:
        if char=="tempo":
            genres.append(low_tempo)
        if char=="acousticness":
            genres.append(low_acousticness)
        if char=="danceability":
            genres.append(low_danceability)
        if char=="energy":
            genres.append(low_energy)
        if char=="loudness":
            genres.append(low_loudness)
        if char=="valence":
            genres.append(low_valence)
    for char in high_chars:
        if char=="tempo":
            genres.append(high_tempo)
        if char=="acousticness":
            genres.append(high_acousticness)
        if char=="danceability":
            genres.append(high_danceability)
        if char=="energy":
            genres.append(high_energy)
        if char=="liveness":
            genres.append(high_liveness)
        if char=="loudness":
            genres.append(high_loudness)
        if char=="speechiness":
            genres.append(high_speechiness)
        if char=="valence":
            genres.append(high_valence)

    genres = sum(genres, [])
#     print(genres)

    duplicates = []
    for i in range(0, len(genres)):
        for j in range(i+1, len(genres)):
            if genres[i]==genres[j]:
                duplicates.append(genres[i])
#     print(duplicates)

    if duplicates==[]:
        final_genre = random.choice(genres)
    else:
        final_genre = random.choice(duplicates)

    print(final_genre)
    return final_genre

def genre_id(genre):
    if genre=="Action":
        return 28
    elif genre=="Adventure":
        return 12
    elif genre=="Comedy":
        return 35
    elif genre=="Crime":
        return 80
    elif genre=="Documentary":
        return 99
    elif genre=="Drama":
        return 18
    elif genre=="Family":
        return 10751
    elif genre=="Fantasy":
        return 14
    elif genre=="History":
        return 36
    elif genre=="Horror":
        return 27
    elif genre=="Musical":
        return 10402
    elif genre=="Mystery":
        return 9648
    elif genre=="Romance":
        return 10749
    elif genre=="Sci-Fi":
        return 878
    elif genre=="Thriller":
        return 53
    elif genre=="War":
        return 10752

genre = produce_genre()
genre_num = genre_id(genre)
print(genre_num)


