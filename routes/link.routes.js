const { Router } = require('express')
const shortid = require('shortid')
const config = require('config')

const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const { from } = req.body

        // получение уникального кода для ссылки
        const code = shortid.generate()

        // Проверка на существоавание данной ссылки в базе данных
        const existing = await Link.findOne({ from })

        if (existing) {
            return res.json({ link: existing })
        }

        // Формирование сокращенной ссылки
        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()

        res.status(201).json({ link })

    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const links = await Link.findById(req.params.id)
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
    }
})

module.exports = router;