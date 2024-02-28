/* setting up the topArtist films table for the database*/
/* this creates the table with all of the fields*/
/*the title needs to be a text type
	there can be multiple genre ids which are numbers so it is of data type int array
	the movie id is an int type
	original language is text type
	original_title is text type
	overview is text type
	popularity doesn't have to be a whole number so it is decimal type
	poster path is a file path so it is text type
	vote average doesn't have to be a whole number so it is decimal type
	vote_count can be a whole number
*/
/* the primary key is id and artist_name this is because two artists could be in the same movie so we want to
 make sure that we can have duplicate movies with different artists*/
create table artistTable (artist_id integer, artist_name text, artist_band text, title text, genre_ids integer[], id int UNIQUE,
original_language text, original_title text, overview text, popularity
decimal, poster_path text, vote_average decimal,
vote_count decimal, PRIMARY KEY(id, artist_name));