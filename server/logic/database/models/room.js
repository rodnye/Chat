const RoomModel = (DataTypes) => { 
     return { 
         chat_id: { 
             type: DataTypes.INTEGER, 
             allowNull: false, 
             unique: true 
         }, 
         pic : { 
             type : DataTypes.STRING, 
             allowNull: true, 
             defaultValue: "SYSTEM" 
         }, 
         type : { 
             type : DataTypes.STRING, 
             allowNull: false, 
         }, 
         gType: { 
             type : DataTypes.STRING, 
             allowNull: true, 
             defaultValue: "public" 
         }, 
         link: { 
             type: DataTypes.STRING, 
             allowNull: false, 
             unique: true 
         }, 
         name: { 
             type: DataTypes.STRING, 
             allowNull: false, 
             unique: true 
         }, 
         desc: { 
             type: DataTypes.STRING 
         }, 
         bgColor: { 
             type: DataTypes.STRING, 
             defaultValue: "SYSTEM" 
         }, 
         textColor: { 
             type: DataTypes.STRING, 
             defaultValue: "SYSTEM" 
         }, 
         owner: { 
             type: DataTypes.INTEGER, 
             allowNull: false 
         }, 
         admins: { 
             type : DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         members: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         banList: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         bots: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         pinned: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         } 
     } 
 } 
  
 module.exports = RoomModel;