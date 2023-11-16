/* setting up the films table for the database*/
/* this creates the table with all of the fields*/
/*the title needs to be a text type
	there can be multiple genre ids which are numbers so it is of data type int array
	the movie id is an int type
	orginal language is text type
	original_title is text type
	overview is text type
	popularity doesn't have to be a whole number so it is decimal type
	poster path is a file path so it is text type
	vote average doesn't have to be a whole number so it is decimal type
	vote_count can be a whole number
*/
create table films (title text, genre_ids integer[], id int,
original_language text, original_title text, overview text, popularity
decimal, poster_path text, release_date DATE, vote_average decimal,
vote_count decimal);
/*this creates an entry into the table for the movie Saw X*/
		insert into films (title, genre_ids, id,
original_language, original_title, overview, popularity, poster_path,
release_date, vote_average, vote_count) values ('Saw X', '{80,27,53}',
951491, 'en', 'Saw X', 'Between the events of Saw and Saw II, a sick and
desperate John Kramer travels to Mexico for a risky and experimental
medical procedure in hopes of a miracle cure for his cancer, only to
discover the entire operation is a scam to defraud the most vulnerable.
Armed with a newfound purpose, the infamous serial killer returns to his
work, turning the tables on the con artists in his signature visceral way
through devious, deranged, and ingenious traps', 987.796,
'/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg','2023-09-26', 7.4,67);
/*this will select all of the entries from the films table*/
		select * from films;
