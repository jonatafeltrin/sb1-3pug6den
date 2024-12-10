const express = require('express');
const db = require('./db.json');
const app = express();
app.use(express.json());
app.post('/login', (req, res) => {
  const username = req.body.username;
  if (username.includes('fulano@gmail.com') || username.includes('passwordExpired@gmail.com')) {
    return res.status(200).json({
      ...db.login,
      result: username.includes('fulano@gmail.com') ? '' : 'password-expired',
      required_consent: [
        {
          idVersion: '5',
          id: '5',
          title: 'Regulamento +arquitetura',
          description: ' ',
          label:
            'Li e aceito o <a target="_blank" href="https://www.portobello.com.br/maisarquitetura/conta/regulamento">Regulamento</a> do programa de relacionamento',
          url: 'https://www.portobello.com.br/maisarquitetura/conta/regulamento',
          required: 'yes',
        },
      ],
    });
  }
  res.status(200).json(db.login);
});
app.get('/stores', (req, res) => res.json(db.stores));
app.get('/events', (req, res) => res.json(db.events));
app.post('/extract', (req, res) => res.json(db.statements));
app.post('/user/notifications', (req, res) => res.json(db.notifications));
app.get('/auth/consent-options', (req, res) => res.json(db['consent-options']));
app.post('/category', (req, res) => res.json(db.category));
app.put('/user/notifications', (req, res) => res.json());
app.post('/latest-transactions', (req, res) => res.json(db.transactions));
app.post('/auth/signup', (req, res) => res.json(db.signup));
app.put('/auth/activate-account', (req, res) => res.json(db['activate-account']));
app.put('/reset-password', (req, res) => res.json());
app.listen(3000, () => console.log('server running'));
