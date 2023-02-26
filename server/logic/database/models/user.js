const UserModel = (DataTypes) => {
    return {
        user_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        acclevel: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        }
    }
}

module.exports = UserModel;