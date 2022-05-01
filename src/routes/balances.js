import express from 'express'
import { getProfile } from '../middleware/getProfile'

const router = express.Router()

/**
 * Deposits money into the the the balance of a client
 * @returns all non terminated contracts from the profile
 */
router.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const { Profile } = req.app.get('models')
    const { profile } = req
    const { userId } = req.params
    const amount = req.body.amount
    const client = await Profile.findOne({ 
        where: { id: userId }
    })

    if(!client)
        return res.status(404).end()

    const jobs = await profile.getUnpaidJobs()
    const toPay = jobs.reduce((total, { price }) => total + price, 0)  
    
    if(toPay / 100 * 25 < amount){
        return res.status(400).json({
            error: 'Cannot deposit more than 25% of the client total of jobs to pay'
        })
    }

    await Profile.update({ balance: client.balance + amount }, {
        where: { id: userId }
    })

    res.json({ success: 'Deposited the money' })
})

export default router;
