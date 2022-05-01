import { Profile } from './profile'
import { Contract } from './contract'
import { Job } from './job'

Profile.hasMany(Contract, { as :'Contractor', foreignKey:'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as : 'Client', foreignKey:'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

export { Profile, Contract, Job }