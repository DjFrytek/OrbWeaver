const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
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
