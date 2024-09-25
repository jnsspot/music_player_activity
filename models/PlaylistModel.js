// models/PlaylistModel.js
const db = require('../config/db');

const Playlist = {
  getAll: (callback) => {
    const query = 'SELECT * FROM music';
    db.query(query, callback);
  },

  addSong: (song, callback) => {
    const query = 'INSERT INTO music (m_name, m_artist, lyrics, m_picture, song) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [song.m_name, song.m_artist, song.lyrics, song.m_picture, song.song], callback);
  },

  removeSong: (id, callback) => {
    const query = 'DELETE FROM music WHERE id = ?';
    db.query(query, [id], callback);
  },
  updateSong: (id, song, callback) => {
    const query = `
      UPDATE music 
      SET m_name = COALESCE(?, m_name), 
          m_artist = COALESCE(?, m_artist), 
          lyrics = COALESCE(?, lyrics), 
          m_picture = COALESCE(?, m_picture), 
          song = COALESCE(?, song) 
      WHERE id = ?`;
    
    db.query(query, [song.m_name, song.m_artist, song.lyrics, song.m_picture, song.song, id], callback);
   },
    getSongById: (id, callback) => {
        const query = 'SELECT * FROM music WHERE id = ?'; // Adjust the table name and column as necessary
        db.query(query, [id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results[0]); // Return the first result
        });
    },

};



  
module.exports = Playlist;
