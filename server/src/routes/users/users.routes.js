const express = require('express');
const router = express.Router();
const { Users } = require('../../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await Users.scope(['withRole']).findOne( {
      where: { id }
    })
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

});

router.post('/user', async (req, res) => {
  res.send('Запрос на создание User обработан')
});

router.put('/user', async (req, res) => {
  res.send('Запрос на обновление User обработан')
});

router.delete('/user', async (req, res) => {
  res.send('Запрос на удаление User обработан')
});

module.exports = router;
