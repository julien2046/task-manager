const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
// const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');


/*
  USERS
*/

// Create one route
const router = new express.Router();

// Create a user
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    // sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
    
  } catch (e) {
    res.status(400).send(e);
  }
})

// Login user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({
      user,
      token
    });

  } catch (e) {
    res.status(400).send();
  }
})

// Lougout user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

// Lougout all user
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

// Get all the users
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
})

// Update one user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates'});
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete one user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    // sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    return res.status(500).send();
  }
});

// Upload an image's avatar
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('Please upload a jpg, jpeg or png document'))
    }

    cb (undefined, true)
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, fit: sharp.fit.contain }).png().toBuffer();
  req.user.avatar = buffer;

  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});


// Delete image's avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    return res.status(500).send();
  }
});

// Get image's avatar
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;