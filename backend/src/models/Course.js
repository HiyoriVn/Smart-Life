module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'courses',
    timestamps: false,
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Course.hasMany(models.Task, {
      foreignKey: 'course_id',
      as: 'tasks',
    });
    Course.hasMany(models.Exam, {
      foreignKey: 'course_id',
      as: 'exams',
    });
  };

  return Course;
};