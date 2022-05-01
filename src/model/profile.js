import Sequelize, { Op } from "sequelize";
import { sequelize } from "../db";

export class Profile extends Sequelize.Model {}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance:{
      type:Sequelize.DECIMAL(12,2)
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor')
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

/**
 * @returns all unpaid jobs from the profile
 */
Profile.prototype.getUnpaidJobs = function(){
  const { Contract, Job } = this.sequelize.models
  return Job.findAll({
    include: [{
      model: Contract,
      required: true,
      where: {
        [Op.or]: [
            { clientId: this.id }, 
            { contractorId: this.id }
        ]
      }
    }],
    where: {
      paid: { [Op.not]: true }
    }
  })
}