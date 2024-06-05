// eslint-disable-next-line
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useEffect, useState } from "react";
// import { color } from "three/examples/jsm/nodes/Nodes.js";
const CLIENT_ID='445f4d10566043b897cafc061a2609a6';
const CLIENT_SECRET='54e1eba9297a45d59a04f01108b589e1';

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken,setAccessToken]=useState("");
  const [albums,setAlbums]=useState([]);
  useEffect(()=>{
    //API Access Token
  var authParameters={
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    body:'grant_type=client_credentials&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET
  }
  fetch('https://accounts.spotify.com/api/token',authParameters)
  .then(result=>result.json())
  .then(data=>setAccessToken(data.access_token))
  },[])

  //Search
  async function search(){
    console.log("Search for "+searchInput);

    //Get Request to get the artist ID Artist ID
    var searchParameters={
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+accessToken
      }
    }
    // console.log('Access token is:'+accessToken)
    var artistID=await fetch('https://api.spotify.com/v1/search?q='+searchInput+'&type=artist',searchParameters)
    .then(response=>response.json())
    .then(data=>{return data.artists.items[0].id })
    console.log("Artist ID is:"+artistID);
    //Get Request with Artist ID grab all the album from that artist
    // eslint-disable-next-line
    var returnedAlbums=await fetch('https://api.spotify.com/v1/artists/'+artistID+'/albums'+'?include_groups=album&market=US&limit=50',searchParameters)
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
      setAlbums(data.items);
    })
    //display those to the application

  }
  console.log(albums)
  return (
    <div className="App" style={{ backgroundColor: 'black'}}>
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search For Artist"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={search}
          >
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album,i)=>{;
            console.log(album);
            return(
            <Card >
              <a href={album.external_urls.spotify} target="blank" ><Card.Img  src={album.images[0].url}/>
              </a>
              <Card.Body >
                <Card.Title >{album.name}</Card.Title> 
                     {/* <br/>{album.external_urls.spotify} */}
              </Card.Body>
            </Card>
            )})}
          
        </Row>
      </Container>
    </div>
  );
}

export default App;
