// This file contains the code for the Recommendations component.
import React, { Component } from 'react';
import '../App.css';

//Component for displaying the movies recommended
class Movies extends Component {
    state = {
        spotify_artist: [],
        spotify_characteristics: [],
        movies: [],
        artMovies: [],
        art_name: "",
        genre_ids: [],
        genres: [],
    };
    async grabChars() {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');

        // Fetch the characteristics
        try {
            const spotify_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
            const spotify_data = await spotify_response.json();
            this.setState({spotify_characteristics: spotify_data});

        } catch (error) {
            console.error("Failed to fetch characteristics", error);
        }
    }
    async grabArtist() {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        // Fetch the artist
        try {
            const spotify_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/top-artists?access_token=${accessToken}`);
            const spotify_dataArt = await spotify_responseArt.json();
            this.setState({spotify_artist: spotify_dataArt.items[0]});
            this.setState({art_name: spotify_dataArt.items[0].name})
            console.log(this.state.art_name);
        } catch (error) {
            console.error("Failed to fetch artist", error);
        }
    }
    async getGenre ()  {
        const characteristics = this.state.spotify_characteristics;
        let low_char_genres = [];
        let less_low_char_genres = [];
        let high_char_genres = [];
        let less_high_char_genres = [];

        Object.entries(characteristics).forEach(([key, value]) => {
            if (key === "speechiness") {
                if (value < 0.66 && value >= 0.33) {
                    less_high_char_genres.push("Documentary", "History");
                } else if (value >= 0.66) {
                    high_char_genres.push("Documentary", "History");
                }
            } else if (key === "loudness") {
                if (value < -40) {
                    low_char_genres.push("Romance", "Family", "Mystery");
                } else if (value < -25 && value >= -40) {
                    less_low_char_genres.push("Romance", "Family", "Mystery");
                } else if (value < -5 && value >= -15) {
                    less_high_char_genres.push("War", "Action", "Horror");
                } else if (value >= -5) {
                    high_char_genres.push("War", "Action", "Horror");
                }
            } else {
                if (value < 0.2) {
                    if (key === "tempo") {
                        low_char_genres.push("Drama", "Romance")
                    } else if (key === "acousticness") {
                        low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
                    } else if (key === "danceability") {
                        low_char_genres.push("Horror", "War", "Documentary", "Crime");
                    } else if (key === "energy") {
                        low_char_genres.push("Romance", "Drama", "Mystery");
                    } else if (key === "valence") {
                        low_char_genres.push("Horror", "War", "Drama", "Crime");
                    }
                } else if (value < 0.4) {
                    if (key === "tempo") {
                        less_low_char_genres.push("Drama", "Romance")
                    } else if (key === "acousticness") {
                        less_low_char_genres.push("Action", "Adventure", "Thriller", "Sci-Fi");
                    } else if (key === "danceability") {
                        less_low_char_genres.push("Horror", "War", "Documentary", "Crime");
                    } else if (key === "energy") {
                        less_low_char_genres.push("Romance", "Drama", "Mystery");
                    } else if (key === "valence") {
                        less_low_char_genres.push("Horror", "War", "Drama", "Crime");
                    }
                } else if (value < 0.8 && value >= 0.6) {
                    if (key === "tempo") {
                        less_high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
                    } else if (key === "acousticness") {
                        less_high_char_genres.push("Romance", "History", "Family");
                    } else if (key === "danceability") {
                        less_high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
                    } else if (key === "energy") {
                        less_high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
                    } else if (key === "valence") {
                        less_high_char_genres.push("Comedy", "Romance", "Family");
                    }
                } else if (value >= 0.8) {
                    if (key === "tempo") {
                        high_char_genres.push("Musical", "Action", "Comedy", "Adventure")
                    } else if (key === "acousticness") {
                        high_char_genres.push("Romance", "History", "Family");
                    } else if (key === "danceability") {
                        high_char_genres.push("Musical", "Family", "Sci-Fi", "Fantasy");
                    } else if (key === "energy") {
                        high_char_genres.push("Adventure", "Action", "Thriller", "Sci-Fi", "Fantasy");
                    } else if (key === "valence") {
                        high_char_genres.push("Comedy", "Romance", "Family");
                    }
                }
            }
        })
        let genres = [];

        genres.push(high_char_genres);
        genres.push(low_char_genres);

        if(high_char_genres.length === 0 && low_char_genres.length === 0) {
            genres.push(less_high_char_genres);
            genres.push(less_low_char_genres);
        }

        genres = genres.flat(1)

        let duplicates = genres.filter((item, index) => genres.indexOf(item) !== index);

        let final_genre = [];

        if(duplicates.length-4 >= 0) {
            let counter = 0;
            while(counter < 4) {
                final_genre.push(duplicates[Math.floor(Math.random()*duplicates.length)]);
                counter+=1;
            }
        } else {
            final_genre.push(duplicates);
            let counter = duplicates.length;
            while(counter < 4) {
                final_genre = genres[Math.floor(Math.random()*genres.length)];
                counter+=1;
            }
        }

        this.setState({genres: final_genre});

        let genre_id = [];
        let index = 0;

        while(index < 4) {
            if (final_genre[index] === "Action") {
                genre_id.push(28);
            } else if (final_genre[index] === "Adventure") {
                genre_id.push(12);
            } else if(final_genre[index] === "Comedy") {
                genre_id.push(35);
            } else if(final_genre[index] === "Crime") {
                genre_id.push(80);
            } else if(final_genre[index] === "Documentary") {
                genre_id.push(99);
            } else if (final_genre[index] === "Drama") {
                genre_id.push(18);
            } else if (final_genre[index] === "Family") {
                genre_id.push(10751);
            } else if (final_genre[index] === "Fantasy") {
                genre_id.push(14);
            } else if (final_genre[index] === "History") {
                genre_id.push(36);
            } else if (final_genre[index] === "Horror") {
                genre_id.push(27);
            } else if (final_genre[index] === "Musical") {
                genre_id.push(10402);
            } else if (final_genre[index] === "Mystery") {
                genre_id.push(9648);
            } else if (final_genre[index] === "Romance") {
                genre_id.push(10749);
            } else if (final_genre[index] === "Sci-Fi") {
                genre_id.push(878);
            } else if (final_genre[index] === "Thriller") {
                genre_id.push(53);
            } else if (final_genre[index] === "War") {
                genre_id.push(10752);
            }
        }
        console.log(genre_id);
        this.setState({genre_ids: genre_id});
        return genre_id;
    }

    async getArtist(){
        const artist = this.state.art_name;
        return artist;
    }

    async componentDidMount() {
        try {
            await this.grabChars();
            await this.grabArtist();
            // const genre_num = await this.getGenre();
            // const artist_name = await this.getArtist();
            const artist_name = this.state.art_name;
            const movie_responseArt = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-artist-movies-from-db?artist_band=${artist_name}`);
            const movie_dataArt = await movie_responseArt.json();
            let index = 0;
            let genres = await this.getGenre();
            let movie_data = [];
            while(index < 4) {
                let id = genres[index];
                const movie_response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${id}`);
                let mv_data = await movie_response.json();
                movie_data.reason = `Because your generated movie genre is ${this.state.genres[index]}`
                movie_data.push(mv_data);
                index+=1;
            }
            console.log(movie_data);
            // let ctr = 0;
            // movie_data.movies.map((item, index) => {
            //     item.reason = `Because your generated movie genre is ${this.state.genres[ctr]}`
            // });
            if(movie_dataArt.movies.length !== 0) {
                movie_data.movies[0] = movie_dataArt.movies[0];
                movie_data.movies[0].reason = `Because your Top Artist is ${artist_name}`;
            }
            this.setState({movies: movie_data.movies});
            this.setState({artMovies: movie_dataArt.movies});
            console.log(movie_data.movies);
            console.log(movie_dataArt.movies[0]);
        } catch (error) {
            // const artist_name = await this.getArtist();
            console.log("failed to fetch artist", error);
            console.log(this.state.art_name);
            console.error("Failed to fetch characteristics, genre, and movies", error);
        }
    }

    // async getDBMovies () {
    //     const genre_id = this.getGenre();
    //     const movie_response = await  fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-movies-from-db?genre_id=${genre_id}`);
    //     const movie_data = await movie_response.json();
    //     this.setState({movies: movie_data});
    //     // return movie_data;
    // }
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.state.movies !== prevState.movies) {
    //         // this.setState(prevState);
    //     }
    // }

    render() {
        // const movies = this.getDBMovies();
        const movies = this.state.movies;
        // const genre = this.state.genre;
        // const isFetching = this.state;
        return (
            <div id="Recommendations">
                <h2>Recommendations</h2>
                <div className="movie-recommendation-container">
                    {/*For every sample movie display its poster, title, and reasoning*/}
                    {movies?.map((item, index) => (
                        <div className="movie-recommendation" key={index}>
                            <div className="reason">
                                <p>{item.reason}</p>
                            </div>
                            <br/>
                            <img className="movie-poster" src={"https://image.tmdb.org/t/p/original" + item.poster_path} alt="movie poster"></img>
                                <h4>{item.title}</h4>
                                <p>{"Rating: " + item.certification}</p>
                        </div>
                    ))}
                </div>
                <div className="warning">
                    <p>Users under the age of 17 should only watch rated R movies with parental permission.</p>
                </div>
            </div>
        )
    }
}

export default Movies;