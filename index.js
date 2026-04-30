import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';

console.log("PORT:", process.env.PORT);

const app = express();
const upload = multer({ dest: '/tmp/' });

app.get('/', (req, res) => {
  res.send('alive');
});

app.post('/split', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const input = req.file.path;

  exec(
    `ffmpeg -i ${input} -f segment -segment_time 60 -c copy /tmp/out_%03d.mp3`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('ffmpeg failed');
      }

      const files = fs.readdirSync('/tmp').filter(f => f.startsWith('out_'));

      const result = files.map(f => {
        const fileData = fs.readFileSync(`/tmp/${f}`).toString('base64');
        return {
          filename: f,
          data: fileData
        };
      });

      res.json(result);
    }
  );
});

const PORT = process.env.PORT;

if (!PORT) {
  console.error("NO PORT FOUND");
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`running on ${PORT}`);
});
