const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Schedule extends Model {}

Schedule.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_auto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Schedule",
    tableName: "schedules",
    timestamps: true,
  },
);

module.exports = Schedule;
