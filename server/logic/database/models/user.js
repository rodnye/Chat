const UserModel = (DataTypes) => {
    return {
        user_id: {
            type: DataTypes.INTEGER,
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
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
        },
        desc: {
            type: DataTypes.STRING
        },
        pic: {
            type: DataTypes.STRING
        },
        rooms: {
            type: DataTypes.STRING,
            defaultValue: "[\"000000\"]"
        },
        bots: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        channels: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        own_rooms: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        own_bots: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        own_channels: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        banList: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        contacts: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        statuses: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        coins: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: "{}"
        },
        acceptInvitations: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            defaultStatus: false
        },
        lastTimeOnline: {
            type: DataTypes.INTEGER,
            defaultValue: 0//new Date().getTime()
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        vip: {
            type: DataTypes.STRING,
            defaultValue: "basic"
        },
        acclevel: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    };
};

module.exports = UserModel;