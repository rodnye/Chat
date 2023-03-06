const MessageModel = (DataTypes) => { 
     return { 
         mess_id: { 
             type : DataTypes.INTEGER, 
             unique : true, 
             allowNull: false 
         }, 
         user_id : { 
             type : DataTypes.INTEGER, 
             allowNull: false 
         }, 
         user_nick: { 
             type: DataTypes.STRING, 
             allowNull: false 
         }, 
         user_color: { 
             type: DataTypes.STRING, 
             allowNull: false 
         }, 
         chat_id : { 
             type: DataTypes.INTEGER, 
             allowNull: false 
         }, 
         type : { 
             type: DataTypes.STRING, 
             defaultValue: "text" 
         }, 
         reply:{ 
             type: DataTypes.INTEGER, 
             allowNull: true 
         }, 
         shared : { 
             type: DataTypes.INTEGER, 
             defaultValue: 0 
         }, 
         isEdited: { 
             type: DataTypes.INTEGER, 
             defaultValue: 0 
         }, 
         isBot: { 
             type: DataTypes.INTEGER, 
             defaultValue: 0 
         }, 
         receivedBy: { 
             type: DataTypes.STRING, 
             defaultValue: "[]", 
         }, 
         seenBy: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         inline: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         keyboard: { 
             type: DataTypes.STRING, 
             defaultValue: "[]" 
         }, 
         message: { 
             type: DataTypes.STRING, 
             allowNull: false 
         }, 
         date : { 
             type: DataTypes.INTEGER, 
             allowNull: false 
         } 
     } 
 }; 
  
  
 module.exports = MessageModel;