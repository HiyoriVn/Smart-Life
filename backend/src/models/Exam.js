const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Exam extends Model {}

Exam.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exam_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "courses",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Exam",
    tableName: "exams",
    timestamps: true,
  },
);

module.exports = Exam;
