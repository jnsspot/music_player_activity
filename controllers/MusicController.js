// controllers/MusicController.js
const Playlist = require('../models/PlaylistModel');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.mimetype.startsWith('image') ? './uploads/images' : './uploads/songs';
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensuring unique filenames
  }
});

// Configure multer to accept both image and song files
const upload = multer({ 
  storage: storage,
  limits: {
      fileSize: 5 * 1024 * 1024 // limit file size to 5MB (optional)
  },
  fileFilter: (req, file, cb) => {
      const acceptableTypes = {
          'image/jpeg': true,
          'image/png': true,
          'audio/mpeg': true,
          'audio/wav': true
      };
      if (acceptableTypes[file.mimetype]) {
          cb(null, true);
      } else {
          cb(new Error('Invalid file type.'), false);
      }
  }
});

// Define fields for multer to expect (m_picture and song)
exports.uploadFiles = upload.fields([
  { name: 'm_picture', maxCount: 1 }, // Expect one image file
  { name: 'song', maxCount: 1 }       // Expect one audio file
]);

// Render 'Add Song' form
exports.renderAddSong = (req, res) => {
  res.render('addSong');
};

// Process form submission to add a song
exports.addSong = (req, res) => {
  console.log('Uploaded files:', req.files);  // Log the uploaded files
  console.log(req.body);

  const m_picture = req.files['m_picture']?.[0]?.filename || null; // Safely access
  const songFile = req.files['song']?.[0]?.filename || null;  

  const song = {
      m_name: req.body.m_name,
      m_artist: req.body.m_artist,
      lyrics: req.body.lyrics,
      m_picture: m_picture,  // Check for the image file
      song: songFile         // Check for the audio file
  };

  Playlist.addSong(song, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Error adding song."); // Send an error response
      }
      res.redirect('/manage');
  });
};

// Show playlist for managing (retrieve, update, delete)
exports.showPlaylist = (req, res) => {
  Playlist.getAll((err, results) => {
    if (err) throw err;
    res.render('managePlaylist', { playlist: results });
  });
};

// Update song details
exports.updateSong = (req, res) => {
    const songId = req.params.id;
    const updatedSong = {
      m_name: req.body.m_name,
      m_artist: req.body.m_artist,
      lyrics: req.body.lyrics,
      m_picture: req.files['m_picture'] ? req.files['m_picture'][0].filename : null,  // Check for new image file
      song: req.files['song'] ? req.files['song'][0].filename : null                 // Check for new audio file
    };
  
    Playlist.updateSong(songId, updatedSong, (err) => {
      if (err) throw err;
      res.redirect('/manage');
    });
};

// Delete a song
exports.deleteSong = (req, res) => {
  const songId = req.params.id;
  Playlist.removeSong(songId, (err) => {
    if (err) throw err;
    res.redirect('/manage');
  });
};
exports.getSongById = (req, res) => {
    const songId = req.params.id;
    Playlist.getSongById(songId, (err, song) => {
      if (err) return res.status(500).send(err.message);
      res.render('updateSong', { song });
    });
};
  exports.getSongLyrics = (req, res) => {
    const songId = req.params.id;

    Playlist.getSongById(songId, (err, song) => {
        if (err) {
            return res.status(500).send("Error fetching song");
        }
        if (!song) {
            return res.status(404).send("Song not found");
        }
        res.render('songLyrics', { song }); // Render the songLyrics.ejs with song data
    });
};