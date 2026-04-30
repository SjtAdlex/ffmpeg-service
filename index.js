import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';

const app = express();
const upload = multer({ dest: '/tmp/' });

app.post('/split', upload.single('file'), (req, res) => {
  const input = req.file.path;

  exec(`ffmpeg -i ${input} -f segment -segment_time 60 -c copy /tmp/out_%03d.mp3`, () => {
    const files = fs.readdirSync('/tmp').filter(f => f.startsWith('out_'));

    const result = files.map(f => ({
      filename: f,
      path: `/tmp/${f}`
    }));

    res.json(result);
  });
});

app.listen(3000, () => console.log('running'));
