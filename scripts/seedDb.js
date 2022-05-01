import { Profile, Contract, Job } from '../src/model'
import { profiles } from './seedData/profiles'
import { contracts } from './seedData/contracts'
import { jobs } from './seedData/jobs'

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
//seed()

export async function seed() {
  // create tables
  await Profile.sync({ force: true })
  await Contract.sync({ force: true })
  await Job.sync({ force: true })
  //insert data
  await Promise.all([
    ...createProfiles(),
    ...createContracts(),
    ...createJobs()
  ])
}

const createContracts = () => {
  return contracts.map((contract) => Contract.create(contract))
}

const createProfiles = () => {
  return profiles.map((profile) => Profile.create(profile))  
}

const createJobs = () => {
  return jobs.map((job) => Job.create(job))  
}