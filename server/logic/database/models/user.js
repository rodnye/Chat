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
            allowNull: false
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
            defaultValue: 1 //0 - banned , 1 - regular , 2 - mod , 3 - admin
        }
    }
}

module.exports = UserModel;