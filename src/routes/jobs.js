import express from 'express'
import { Op } from 'sequelize'
import { getProfile } from '../middleware/getProfile'

const router = express.Router()

/**
 * @returns all unpaid jobs
 */
router.get('/jobs/unpaid', getProfile, async (req, res) => {
    const { profile } = req
    const jobs = await profile.getUnpaidJobs()
    res.json(jobs)
})

/**
 * Pays for a job
 */
router.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const { job_id } = req.params
    const { profile } = req

    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            required: true
        }],
        where: { 
            ContractId: job_id,
            paid: { [Op.not]: true }
        }
    })

    if(!jobs.length)
        return res.status(404).end()

    const client = await Profile.findOne({
        where: {
            id: profile.id
        }
    })

    const price = jobs.reduce((total, { price }) => total + price, 0)

    if(price > client.balance) {
        return res.status(400).json({
            error: 'Not enough balance'
        })
    }

    const contractor = await Profile.findOne({
        where: {
            id: jobs[0].Contract.ContractorId
        }
    })

    await Profile.update({ balance: contractor.balance + price }, {
        where: { id: contractor.id }
    })

    await Profile.update({ balance: client.balance - price }, {
        where: { id: client.id }
    })

    await Job.update({ paid: true }, {
        where: { 
            ContractId: job_id,
            paid: { [Op.not]: true }
        }
    })

    res.json({
        success: 'Paid all the pending jobs of the contract'
    })
})

export default router;
