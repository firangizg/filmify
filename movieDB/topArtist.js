
//import .env, fetch, and postgres
import * as dotenv from "dotenv";
 import fetch from 'node-fetch';
 import pgp from 'pg-promise';
 import pkg from "pg";
 const {Pool} = pkg;


//configure .env for use
dotenv.config();

//get database credentials from .env file
const credentials = {
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
};
//These lists are lists of the topArtists on Spotify currently
//we will be able to cycle through these arrays and add each of their movies to the topArtist films table in the database
let list = [
  "Drake", "Bad Bunny", "Taylor Swift", "The Weeknd", "Justin Bieber", "Ed Sheeran", "Eminem", "Ariana Grande",
  "Travis Scott", "Kanye West", "Post Malone", "J Balvin", "Rihanna", "BTS", "Ozuna", "Juice WRLD", "Future",
  "Nicki Minaj", "Kendrick Lamar", "Billie Eilish", "Chris Brown", "Imagine Dragons", "Bruno Mars", "XXXTENTACION",
  "Coldplay", "Dua Lipa", "Daddy Yankee", "Khalid", "Lil Wayne", "David Guetta", "21 Savage", "Anuel AA", "Lil Baby",
  "Maroon 5", "Lil Uzi Vert", "Maluma", "Lana Del Rey", "Beyoncé", "Rauw Alejandro", "Calvin Harris", "Sia", "J. Cole",
  "Shawn Mendes", "Young Thug", "Sam Smith", "Farruko", "KAROL G", "Queen", "Doja Cat", "Harry Styles", "Myke Towers",
  "Selena Gomez", "Lady Gaga", "SZA", "Nicky Jam", "One Direction", "Halsey", "Adele", "Ty Dolla $ign", "Shakira",
  "Wiz Khalifa", "Katy Perry", "The Chainsmokers", "The Beatles", "Feid", "Linkin Park", "Cardi B", "Gunna", "Marshmello",
  "Arctic Monkeys", "Miley Cyrus", "DaBaby", "JAY-Z", "Camila Cabello", "Metro Boomin", "Avicii", "A$AP Rocky", "Arijit Singh",
  "Quavo", "Pitbull", "Olivia Rodrigo", "Twenty One Pilots", "Kygo", "Sech", "Frank Ocean", "Tyga", "Tyler, The Creator",
  "Red Hot Chili Peppers", "Snoop Dogg", "OneRepublic", "Trippie Redd", "Jason Derulo", "Morgan Wallen", "Bebe Rexha",
  "Mac Miller", "Arcángel", "Demi Lovato", "Michael Jackson", "A Boogie Wit da Hoodie", "Pop Smoke", "Charlie Puth",
  "Swae Lee", "Big Sean", "Migos", "Elton John", "YoungBoy Never Broke Again", "$uicideboy$", "Tiësto", "Kodak Black",
  "Peso Pluma", "Sebastian Yatra", "50 Cent", "BLACKPINK", "Metallica", "G-Eazy", "Lil Peep", "Diplo", "Romeo Santos",
  "Manuel Turizo", "Gucci Mane", "Ellie Goulding", "Playboi Carti", "Polo G", "Daft Punk", "DJ Snake", "Alan Walker",
  "P!nk", "Justin Timberlake", "Jhayco", "2 Chainz", "Pritam", "Sean Paul", "Marília Mendonça", "Panic! At The Disco",
  "James Arthur", "Logic", "Die drei ???", "The Neighbourhood", "Tory Lanez", "Justin Quiles", "Offset", "Lil Nas X",
  "AC/DC", "Roddy Ricch", "Junior H", "Lil Durk", "Martin Garrix", "Disney", "USHER", "Luis Miguel", "Pharrell Williams",
  "Fall Out Boy", "Kid Cudi", "Bizarrap", "Major Lazer", "NF", "Lenny Tavárez", "John Mayer", "blackbear", "Luke Combs",
  "Wisin", "Duki", "Joji", "Nirvana", "Britney Spears", "The Kid LAROI", "Lewis Capaldi", "Akon", "mgk", "Don Omar",
  "5 Seconds of Summer", "Flo Rida", "Anitta", "Becky G", "Black Eyed Peas", "Anne-Marie", "ROSALÍA", "Green Day",
  "Macklemore", "Robin Schulz", "Zedd", "Henrique & Juliano", "Chance the Rapper", "Lil Yachty", "ZAYN", "Lauv",
  "Fleetwood Mac", "Lil Tjay", "Zara Larsson", "Camilo", "Zion & Lennox", "Bob Marley & The Wailers", "French Montana",
  "Kali Uchis", "John Legend", "Michael Bublé", "Little Mix", "DJ Khaled", "Jack Harlow", "Jorge & Mateus", "Childish Gambino",
  "2Pac", "Pink Floyd", "Morat", "Dr. Dre", "Guns N' Roses", "Skrillex", "Hozier", "Ne-Yo", "Enrique Iglesias", "Mariah Carey",
  "Christian Nodal", "Ava Max", "The Rolling Stones", "Meghan Trainor", "Megan Thee Stallion", "Bryson Tiller", "Rick Ross",
  "Miguel", "Gorillaz", "Reik", "Banda MS de Sergio Lizárraga", "Yandel", "Meek Mill", "Gusttavo Lima", "Natanael Cano",
  "Alessia Cara", "Florida Georgia Line", "Clean Bandit", "Labrinth", "Don Toliver", "Radiohead", "Darell", "Jul", "Alicia Keys",
  "Russ", "Melanie Martinez", "TWICE", "Tame Impala", "Jeremih", "Jonas Blue", "Frank Sinatra", "Wisin & Yandel", "Lorde",
  "Luis Fonsi", "Elvis Presley", "Troye Sivan", "Christina Aguilera", "Foo Fighters", "Ninho", "U2", "David Bowie", "ABBA",
  "blink-182", "System Of A Down", "Carin Leon", "Julia Michaels", "Bastille", "YG", "The 1975", "The Notorious B.I.G.",
  "Jhené Aiko", "Quevedo", "NAV", "Fuerza Regida", "The Killers", "Kehlani", "Daniel Caesar", "Paulo Londra", "Eladio Carrion",
  "Rels B", "Ñengo Flow", "Mora", "Madonna", "Paramore", "PARTYNEXTDOOR", "T-Pain", "Dalex", "Grupo Firme", "Rammstein",
  "Tainy", "Chencho Corleone", "Led Zeppelin", "Slipknot"];
let list2 = [ "Creedence Clearwater Revival", "Tove Lo", "Kesha", "Bon Jovi", "Alok", "De La Ghetto", "6ix9ine", "Marc Anthony",
    "Brent Faiyaz", "Rita Ora", "Tate McRae", "Stray Kids", "Lil Tecca", "Zé Neto & Cristiano", "Anderson .Paak",
    "Zach Bryan", "The Lumineers", "Rae Sremmurd", "Anirudh Ravichander", "NATTI NATASHA", "6LACK", "Maria Becerra",
    "Jonas Brothers", "Bonez MC", "Luke Bryan", "T.I.", "Fetty Wap", "Wizkid", "Muse", "Oasis", "Jennifer Lopez",
    "Matheus & Kauan", "Bring Me The Horizon", "Ludacris", "Niall Horan", "Felix Jaehn", "Sfera Ebbasta", "Bryant Myers",
    "Charli XCX", "My Chemical Romance", "Måneskin", "Jack Johnson", "Juicy J", "Conan Gray", "Glass Animals",
    "League of Legends", "Piso 21", "Summer Walker", "JID", "RAF Camora", "Florence + The Machine", "Jess Glynne",
    "Hailee Steinfeld", "Nickelback", "Maná", "Alesso", "Whitney Houston", "R3HAB", "Kevin Gates", "Mumford & Sons",
    "Steve Aoki", "MØ", "ScHoolboy Q", "Bruce Springsteen", "Cartel De Santa", "Kelly Clarkson", "Bazzi", "Stevie Wonder",
    "Aventura", "Mark Ronson", "Chris Stapleton", "NLE Choppa", "Prince Royce", "Steve Lacy", "Alejandro Fernández",
    "Avril Lavigne", "Kings of Leon", "Giveon", "Vance Joy", "Wesley Safadão", "Maiara & Maraisa", "Disclosure",
    "Burna Boy", "Aerosmith", "Kane Brown", "Lizzo", "Five Finger Death Punch", "The Script", "Amy Winehouse", "Danny Ocean",
    "Cheat Codes", "Nate Dogg", "Brytiago", "Mitski", "Ski Mask The Slump God", "Timbaland", "Rex Orange County", "Billy Joel",
    "Calibre 50", "El Alfa", "Lost Frequencies", "Jason Mraz", "YNW Melly", "Johnny Cash", "Macklemore & Ryan Lewis",
    "Capital Bra", "TINI", "H.E.R.", "iann dior", "Grupo Frontera", "Galantis", "Mac DeMarco", "Thomas Rhett",
    "Backstreet Boys", "Alejandro Sanz", "The Offspring", "Ryan Lewis", "Trey Songz", "DJ Luian", "Hans Zimmer",
    "Ricardo Arjona", "Fifth Harmony", "Bon Iver", "Nelly", "Eagles", "Lil Skies", "Shreya Ghoshal", "Mustard",
    "The Strokes", "Jason Aldean", "Juanes", "Disturbed", "Luis R Conriquez", "Calum Scott", "Dave", "Pearl Jam",
    "Glee Cast", "RAYE", "Three Days Grace", "A$AP Ferg", "Moneybagg Yo", "Alec Benjamin", "Nio Garcia", "Plan B",
    "Mambo Kingz", "Avenged Sevenfold", "Jung Kook", "SEVENTEEN", "Lil Pump", "Yeat", "Phil Collins", "Rod Wave",
    "Sabrina Carpenter", "Jay Wheeler", "Dean Lewis", "KHEA", "George Ezra", "Eslabon Armado", "Noriel", "James Bay",
    "Bryan Adams", "Bee Gees", "Original Broadway Cast of Hamilton", "B.o.B", "Joan Sebastian", "Los Ángeles Azules",
    "24kGoldn", "Vicente Fernández", "Céline Dion", "Central Cee", "Pablo Alborán", "Dire Straits", "Clairo", "X Ambassadors",
    "The Police", "LANY", "AFROJACK", "Flume", "Luciano", "Dan + Shay", "benny blanco", "Tones And I", "Train", "Lunay",
    "Ricky Martin", "MGMT", "Chase Atlantic", "Lin-Manuel Miranda", "Outkast", "Rich The Kid", "Cazzu", "La Arrolladora Banda El Limón De Rene Camacho",
    "PnB Rock", "Nicki Nicole", "Becky Hill", "Jesse & Joy", "AJR", "Jax Jones", "Alfredo Olivas", "Lil Mosey", "Daya", "Noah Kahan",
    "Damso", "Lukas Graham", "will.i.am", "Jessie J", "Cigarettes After Sex", "MEDUZA", "Armin van Buuren", "Bibi und Tina",
    "ILLENIUM", "Stormzy", "Juan Gabriel", "Nelly Furtado", "The Cure", "Maren Morris"];
let list3 = ["Iggy Azalea", "Luan Santana", "Sam Feldt", "Cage The Elephant", "Tiago PZK", "Kid Ink", "A.R. Rahman", "Korn", "Passenger", "Nas",
    "Seeb", "Jeremy Zucker", "Marvin Gaye", "Carlos Vives", "Foster The People", "Tom Odell", "Lyanno", "The Smiths", "John Williams",
    "Sigala", "Soda Stereo", "Ufo361", "Pentatonix", "The Game", "CNCO", "Cosculluela", "Gwen Stefani", "Hillsong Worship", "Bob Dylan",
    "Blake Shelton", "James Blunt", "Zac Brown Band", "Madison Beer", "Journey", "Baby Keem", "Gzuz", "Gerardo Ortiz", "TOMORROW X TOGETHER",
    "Juan Magán", "Depeche Mode", "Chief Keef", "Zion", "Iron Maiden", "Wale", "Skillet", "Paul McCartney", "Santa Fe Klan", "Gera MX",
    "PNL", "C. Tangana", "Sam Hunt", "Mau y Ricky", "Lil Jon", "Carly Rae Jepsen", "Weezer", "Imanbek", "The Doors", "Swedish House Mafia",
    "bbno$", "Joey Bada$$", "Shaggy", "Pusha T", "Tim McGraw", "Boyce Avenue", "Eric Church", "MARINA", "Marco Antonio Solís", "NewJeans",
    "Skepta", "Rod Stewart", "Ludovico Einaudi", "The Black Keys", "alt-J", "Aitana", "Ice Cube", "Noah Cyrus", "Ana Castela", "Deftones",
    "MC Ryan SP", "DJ Nelson", "Birdy", "Mike Posner", "Rudimental", "Papa Roach", "El Fantasma", "Dermot Kennedy", "Limp Bizkit", "R.E.M.",
    "Earth, Wind & Fire", "Los Tigres Del Norte", "Gente De Zona", "Juan Luis Guerra 4.40", "Joyner Lucas", "Joel Corry", "Oliver Tree",
    "Rise Against", "LUDMILLA", "Grupo Marca Registrada", "Kenny Chesney", "The Beach Boys"];
//creates global variables
let globaltopArtist = "";
let topArtist_id = 0;
let topArtist_name = "";
let topArtist_band = "";
//this function gets the artist's ID number using an API call so that we can use it in the next API call
//to get all the movie credits associated with the artist
async function getArtist(topArtist){
    //sets the url and options for the query
    const url = `https://api.themoviedb.org/3/search/person?query=${topArtist}&include_adult=false&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    };
    //sets the global variable
    globaltopArtist = topArtist;
    let artists = [];
    try{
        //this is the api call where it uses the url and the options specified above
        const resp = await fetch(`${url}`, options);
        const data = await resp.json();
        console.log(data);
        data.results.forEach(artist =>{
            let {id, name} = artist;
            artists.push({id, name});
        });
        //sets the global variables with their values for the artist
         topArtist_id = artists[0].id;
         topArtist_name = artists[0].name;
        return topArtist_id;
    }
    catch(err){
        //print error message
        console.error(`oops: ${err}`);

    }
}
//this function is an API call to get the movie credits for a person by their ID which we got in the previous
//API call and pass into this function
async function getArtistMovies(topArtist_id, globalTop) {
    //sets the url and options for the query
    const url = `https://api.themoviedb.org/3/person/${topArtist_id}/movie_credits?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    };
    let artistMovies = [];
        try{
            //this is the api call where it uses the url and the options specified above
            const resp = await fetch(`${url}`, options);
            const data = await resp.json();
            data.cast.forEach(artistMovie => {
                //this lets the values for the movies/columns be a movie "object" in the array
                let { title, genre_ids, id, original_language, original_title,
                    overview, popularity, poster_path, vote_average,
                    vote_count } = artistMovie;
                //fix and add the escape characters
                const re = /'/gi;
                title = title.replace(re,"''");
                original_title = original_title.replace(re,"''");
                overview = overview.replace(re,"''");
                //sets the variables to pass into the query for the database
                let artist_id = topArtist_id;
                let artist_name = topArtist_name;
                let artist_band = globalTop;
                //add the movie to the array
                artistMovies.push({artist_id, artist_name, artist_band, title, genre_ids, id, original_language, original_title,
                    overview, popularity, poster_path, vote_average,
                    vote_count});
            });
               // console.log(artistMovies[0]);
            //here is the query and what will be sent to the database through the connection we set up with the credentials
            artistMovies = JSON.stringify(artistMovies);
            const query = pgp.as.format(`INSERT INTO artisttable SELECT * FROM json_populate_recordset(null::artisttable,'${artistMovies}')
                                               ON CONFLICT (id) DO UPDATE SET popularity = EXCLUDED.popularity,
                                               vote_average = EXCLUDED.vote_average, vote_count = EXCLUDED.vote_count`);
            //query
            const pool = new Pool(credentials);
            const now = await pool.query(query);
            await pool.end();
            artistMovies = [];
        }
        catch(err){
            //print error message
            console.error(`oops: ${err}`);

        }
}
//this is a loop that will go through an entire list or array of the artists and get the movies for each one and put it
//into the database
//change the list to add more artists
//currently have list, list2, and list3
for (let i=0; i<list3.length;i++){
   let artistN = await getArtist(list3[i]);
   await getArtistMovies(artistN, list3[i]);
   //tells you which number you just inserted into the database
   console.log(i);
}