const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Statistics extends Model {}

Statistics.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  total_tasks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  completed_tasks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  study_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Statistics',
  tableName: 'statistics',
  timestamps: false,
});

module.exports = Statistics;