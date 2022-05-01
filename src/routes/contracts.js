import express from 'express'
import { Op } from 'sequelize'
import { getProfile } from '../middleware/getProfile'

const router = express.Router()

/**
 * @returns all non terminated contracts from the profile
 */
router.get('/contracts', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models')
    const { profile } = req
    const contracts = await Contract.findAll({ 
        where: { 
            [Op.or]: [
                { clientId: profile.id }, 
                { contractorId: profile.id }
            ],
            status: { [Op.not]: 'terminated' }
        }
    })
    res.json(contracts)
})

/**
 * @returns contract by id
 */
router.get('/contracts/:id', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const { profile } = req
    const contract = await Contract.findOne({ where: { id }})
    
    if(!contract) 
        return res.status(404).end()

    if(contract.ClientId !== profile.id && contract.ContractorId !== profile.id) 
        return res.status(401).end()

    res.json(contract)
})

export default router;
