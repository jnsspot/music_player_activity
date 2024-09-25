// routes/router.js
const express = require('express');
const router = express.Router();
const MusicController = require('../controllers/MusicController');

// Redirect the root path '/' to '/manage'
router.get('/', (req, res) => {
  res.redirect('/manage');
});

// Route to show the 'Add Song' form
router.get('/add', MusicController.renderAddSong);
router.post('/add', MusicController.uploadFiles, MusicController.addSong);

// Route to show the 'Manage Playlist' (retrieve, update, delete)
router.get('/manage', MusicController.showPlaylist);

// Route to handle deleting a song
router.get('/delete/:id', MusicController.deleteSong);

// Route to show the 'Update Song' form
router.get('/update/:id', MusicController.getSongById); // Use the method from MusicController

// Route to handle updating a song
router.post('/update/:id', MusicController.uploadFiles, MusicController.updateSong);

router.get('/song/:id', MusicController.getSongLyrics);
module.exports = router;
