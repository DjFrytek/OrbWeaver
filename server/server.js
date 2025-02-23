const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

app.use(cors());

const supabaseUrl = 'https://gnfnluvybudvnqhbqzmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZm5sdXZ5YnVkdm5xaGJxem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNTA2ODEsImV4cCI6MjA1NTkyNjY4MX0.Cl8t8INMU32NBvTVwOlsIK-YTvZZubyBTLc4odW2oqg';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.post('/api/save-score', async (req, res) => {
  const { levelId, finishTime, playerId, replayData } = req.body;

  try {
    const { data, error } = await supabase
      .from('replays')
      .insert([
        { levelId: levelId, finishTime: finishTime, playerId: playerId, replayData: replayData },
      ]);

    if (error) {
      console.error(error);
      return res.status(500).send('Error saving replay');
    }

    res.send('Replay saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving replay');
  }
});

app.get('/api/get-highscores', async (req, res) => {
  const { levelId } = req.query;

  try {
    const { data, error } = await supabase
      .from('replays')
      .select('id, levelId, finishTime, replayData')
      .eq('levelId', levelId)
      .order('finishTime', { ascending: true })
      .limit(10);

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
