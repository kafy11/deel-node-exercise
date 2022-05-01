import { Profile } from '../'
import { expectJobsFromProfile, expectUnpaidJobs } from '../../test/expects'

describe('getUnpaidJobs', () => {
    let profile, jobs

    beforeEach(async () => {
        profile = await Profile.findOne({ where: { id: 1 }})
        jobs = await profile.getUnpaidJobs()
    })

    it('should fetch only jobs from the profile', async () => {
        expectJobsFromProfile(jobs, profile.id)
    })

    it('should fetch only unpaid jobs', async () => {
        expectUnpaidJobs(jobs)
    })
})