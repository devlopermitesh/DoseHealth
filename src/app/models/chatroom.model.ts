import mongoose,{model,Schema} from "mongoose";
enum Status{
    active="active",
    completed="completed",
    closed="closed"
}
export interface IChatroom {
    sender_id: mongoose.Schema.Types.ObjectId;
    receiver_id: mongoose.Schema.Types.ObjectId;
    Messages: mongoose.Schema.Types.ObjectId[];
    lastMessage: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    status: Status   
}
const ChatroomSchema:Schema<IChatroom>=new Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.active,
    },

})

const ChatroomModel=(mongoose.models.Chatroom as mongoose.Model<IChatroom>)||model<IChatroom>("Chatroom",ChatroomSchema);

export default ChatroomModel