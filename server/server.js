const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;

app.use(cors());
app.use(express.json({limit: "10mb", extended: true}));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Rejestracja użytkownika w Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign up error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Generowanie losowego nicku
    const randomNumber = Math.floor(Math.random() * 10000000); // Losowa liczba od 0 do 9999999
    const nickname = `GUEST${randomNumber.toString().padStart(7, '0')}`; // Format GUEST0000000

    // Tworzenie rekordu w tabeli `users`
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { id: data.user.id, nickname: nickname }
      ]);

    if (userError) {
      console.error('Error creating user in users table:', userError);
      return res.status(500).json({ error: 'Failed to create user record' });
    }

    // Supabase automatycznie zwraca JWT token po udanej rejestracji
    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Supabase automatically returns a JWT token upon successful sign-in.
    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.post('/api/save-score', async (req, res) => {
  const { levelId, finishTime, token, replayData } = req.body;

  if (!token) {
    console.log("brak tokena");
    return res.status(401).json({ error: 'Brak tokena' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    console.log("nieprawidlowy token");
    return res.status(401).json({ error: 'Nieprawidłowy token' });
  }

  try {
    // Check if a replay already exists for this player and level
    const { data: existingReplays, error: existingReplayError } = await supabase
      .from('replays')
      .select('id, finishTime')
      .eq('playerId', userId)
      .eq('levelId', levelId);

    if (existingReplayError) {
      console.error('Error checking for existing replay:', existingReplayError);
      return res.status(500).send('Error saving replay');
    }

    if (existingReplays && existingReplays.length > 0) {
      const existingReplay = existingReplays[0];
      // If a replay exists, check if the new time is faster
      if (finishTime < existingReplay.finishTime) {
        // Delete the existing replay
        const { data: deleteData, error: deleteError } = await supabase
          .from('replays')
          .delete()
          .eq('id', existingReplay.id);

        if (deleteError) {
          console.error('Error deleting replay:', deleteError);
          return res.status(500).send('Error saving replay');
        }

        // Insert the new replay
        const { data, error } = await supabase
          .from('replays')
          .insert([
            { levelId: levelId, finishTime: finishTime, replayData: replayData, playerId: userId },
          ]);

        if (error) {
          console.error('Error saving replay:', error);
          return res.status(500).send('Error saving replay');
        }

        res.status(201).send('Replay saved successfully');
      } else {
        // If the new time is not faster, do not save the replay
        return res.status(200).send('Replay not saved: New replay is not faster than existing replay');
      }
    } else {
      // If no replay exists, insert the new replay
      const { data, error } = await supabase
        .from('replays')
        .insert([
          { levelId: levelId, finishTime: finishTime, replayData: replayData, playerId: userId },
        ]);

      if (error) {
        console.error('Error saving replay:', error);
        return res.status(500).send('Error saving replay');
      }

      res.status(201).send('Replay saved successfully');
    }
  } catch (error) {
    console.error('Error saving replay:', error);
    res.status(500).send('Error saving replay');
  }
});

app.get('/api/get-nickname', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching nickname:', error);
      return res.status(500).json({ error: 'Error fetching nickname' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Nickname not found' });
    }

    res.json({ nickname: data.nickname });
  } catch (error) {
    console.error('Error fetching nickname:', error);
    res.status(500).json({ error: 'Error fetching nickname' });
  }
});

app.get('/api/get-my-ranking-on-level', async (req, res) => {
  const { levelId } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    // 1. Pobierz replay gracza dla danego levelu
    const { data: replay, error: replayError } = await supabase
      .from('replays')
      .select('*, users(nickname)')
      .eq('levelId', levelId)
      .eq('playerId', userId)
      .single(); // Bo każdy gracz ma tylko 1 replay na level

    if (replayError || !replay) {
      return res.status(404).json({ error: "Replay not found" });
    }

    // 3. Oblicz ranking gracza na danej mapie
    const { count, error: rankError } = await supabase
      .from('replays')
      .select('*', { count: 'exact' })
      .eq('levelId', levelId)
      .or(`finishTime.lt.${replay.finishTime},and(finishTime.eq.${replay.finishTime},created_at.lt.${replay.created_at})`);

    if (rankError) {
      console.error("Ranking error:", rankError);
      return res.status(500).json({ error: "Failed to calculate ranking" });
    }

    const playerRank = count + 1; // Ranking zaczyna się od 1, a nie 0

    // 4. Zwróć replay z rankingiem
    res.json({
      replay,
      rank: playerRank
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/update-nickname', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { nickname } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (nickname.length > 16) {
    return res.status(401).json({ error: 'Nickname too long' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ nickname: nickname })
      .eq('id', userId);

    if (error) {
      console.error('Error updating nickname:', error);
      return res.status(500).json({ error: 'Error updating nickname' });
    }

    res.json({ message: 'Nickname updated successfully' });
  } catch (error) {
    console.error('Error updating nickname:', error);
    res.status(500).json({ error: 'Error updating nickname' });
  }
});

app.get('/api/get-highscores', async (req, res) => {
  const { levelId } = req.query;

  try {
    const { data, error } = await supabase
      .from('replays')
      .select('id, levelId, finishTime, users(nickname)')
      .eq('levelId', levelId)
      .order('finishTime', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error(error);
      return res.status(500).send('Error getting highscores');
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting highscores');
  }
});

app.get('/api/get-my-global-ranking', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const { data, error } = await supabase
      .from('player_scores')
      .select('*')
      .eq('playerId', userId)
      .single();

    if (error) {
      console.error('Error getting user global ranking:', error);
      return res.status(500).json({ error: 'Error getting user global ranking' });
    }

    if (!data) {
      return res.status(404).json({ error: 'User global ranking not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error getting user global ranking:', error);
    res.status(500).json({ error: 'Error getting user global ranking' });
  }
});

app.get('/api/get-global-ranking', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('player_scores')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      return res.status(500).send('Error getting global ranking');
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting global ranking');
  }
});

app.get('/api/get-my-levels-times', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const { data, error } = await supabase
      .from('replays')
      .select('*')
      .eq('playerId', userId);

    if (error) {
      console.error('Error fetching user replays:', error);
      return res.status(500).json({ error: 'Error fetching user replays' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching user replays:', error);
    res.status(500).json({ error: 'Error fetching user replays' });
  }
});

app.get('/api/get-replay', async (req, res) => {
  const { replayId } = req.query;
  console.log("Pobieram replay id " + replayId);

  if (!replayId) {
    return res.status(400).json({ error: 'Replay ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('replays')
      .select('*, users(nickname)')
      .eq('id', replayId)
      .single();

    if (error) {
      console.error('Error fetching replay by ID:', error);
      return res.status(500).json({ error: 'Error fetching replay' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Replay not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching replay by ID:', error);
    res.status(500).json({ error: 'Error fetching replay' });
  }
});

async function getUserIdFromToken(token) {
  try {
    const decoded = jwt.decode(token); // Odczytujemy payload JWT
    return decoded?.sub; // 'sub' to UUID użytkownika w Supabase
  } catch (error) {
    console.error('Błąd dekodowania tokena:', error.message);
    return null;
  }
}

app.post('/dont-fall-sleep', (req, res) => {
  console.log('I am not sleeping');
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
