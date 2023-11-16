create table films (title text, genre_ids integer[], id int, 
original_language text, original_title text, overview text, popularity 
decimal, poster_path text, release_date DATE, vote_average decimal, 
vote_count decimal);
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
		select * from films; 
