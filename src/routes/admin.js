import express from 'express'
import { Op } from 'sequelize'
import { sequelize } from '../db'
import { getProfile } from '../middleware/getProfile'
import { getTimePeriod } from '../middleware/getTimePeriod'

const router = express.Router()

/**
 * @returns the profession that earned the most money
 */
router.get('/admin/best-profession', getProfile, getTimePeriod, async (req, res) => {
    const { period } = req
    const { Job, Contract, Profile } = req.app.get('models')
    const profession = await Job.findOne({
        attributes: [
            'Contract.Contractor.profession',
            [sequelize.fn('sum', sequelize.col('price')),'totalAmount']
        ],
        include: [{
            model: Contract,
            required: true,
            include: [{
                model: Profile,
                required: true,
                as: 'Contractor'
            }]
        }],
        where:{
            paymentDate: {
                [Op.between]: [period.start, period.end]
            },
            paid: true
        },
        group: ['Contract.Contractor.profession'],
        order: [[sequelize.literal('totalAmount'), 'DESC']]
    })
    
    res.json(profession.Contract.Contractor.profession)
})

/**
 * @returns the clients that paid the most for jobs
 */
router.get('/admin/best-clients', getProfile, getTimePeriod, async (req, res) => {
    const limit = req.query.limit || 2
    const { period } = req
    const { Job, Contract, Profile } = req.app.get('models')
    const clients = await Job.findAll({
        attributes: [
            'Contract.Client.id',
            [sequelize.fn('sum', sequelize.col('price')),'totalAmount']
        ],
        include: [{
            model: Contract,
            required: true,
            include: [{
                model: Profile,
                required: true,
                as: 'Client'
            }]
        }],
        where:{
            paymentDate: {
                [Op.between]: [period.start, period.end]
            },
            paid: true
        },
        group: ['Contract.Client.id'],
        order: [[sequelize.literal('totalAmount'), 'DESC']],
        limit
    })
    res.json(clients)
})

export default router;
