import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://fsa-puppy-bowl.herokuapp.com/api/2109-UNF-HY-WEB-PT/players';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    breed: '',
    status: 'bench',
    imageUrl: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}?sort=position&order=asc`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPlayers(data.data.players);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer((prevPlayer) => ({
      ...prevPlayer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Before fetch:', JSON.stringify({ player: newPlayer }));
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newPlayer.name,
          breed: newPlayer.breed,
          status: newPlayer.status,
          imageUrl: newPlayer.imageUrl,
        }),
      });
      console.log('After fetch:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Reset the form fields after successful submission
      setNewPlayer({
        name: '',
        breed: '',
        status: 'bench',
        imageUrl: '',
      });

      // Fetch the updated list of players after adding a new one
      fetchData();
    } catch (error) {
      console.error('Error creating a new player:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response data:', error.response.data);
        console.error('Server response status:', error.response.status);
        console.error('Server response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Request details:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error details:', error.message);
      }
    }
  };

  return (
    <div className="App">
      <h1>Puppy Bowl Players</h1>
      <div className="add-player-form">
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={newPlayer.name} onChange={handleInputChange} required />
          </label>
          <label>
            Breed:
            <input type="text" name="breed" value={newPlayer.breed} onChange={handleInputChange} required />
          </label>
          <label>
            Image URL:
            <input type="url" name="imageUrl" value={newPlayer.imageUrl} onChange={handleInputChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={newPlayer.status} onChange={handleInputChange}>
              <option value="bench">Bench</option>
              <option value="field">Field</option>
            </select>
          </label>
          <button type="submit">Add Puppy</button>
        </form>
      </div>
      <div className="player-list">
        {Array.isArray(players) && players.length > 0 ? (
          players.map((player) => (
            <div key={player.id} className="player-item">
              <img src={player.imageUrl} alt={player.name} />
              <h4>{player.name}</h4>
              <p>{player.breed}</p>
              <p>Status: {player.status}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default App;
