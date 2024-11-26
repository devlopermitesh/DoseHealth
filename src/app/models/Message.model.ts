import mongoose,{model,Schema} from "mongoose";

enum Message_type{
    text="text",
    image='image',
    video='video',
    audio='audio',
    file='file'

}
enum Status{
 sent="sent",
 delivered="delivered",
 read="read"
}
export interface IMessage extends Document{
    sender_id:mongoose.Schema.Types.ObjectId,
    receiver_id:mongoose.Schema.Types.ObjectId,
    sender_role:string,
    receiver_role:string,
    message_type:Message_type,
    content:string,
    media_url:string,
    created_at:Date
    status:Status,


}
const MessageSchema:Schema<IMessage>=new Schema({
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
sender_role: {
    type: String,
    required: true,
},
receiver_role: {
    type: String,
    required: true,
},
message_type: {
    type: String,
    enum: Object.values(Message_type),
    required: true,
},
content: {
    type: String,
    required: true,
},
media_url: {
    type: String,
    required: false,
},
created_at: {
    type: Date,
    default: Date.now,
},
status: {
    type: String,
    enum: Object.values(Status),
    default: Status.sent,
},
},{
    timestamps:true
})


const MessageModel = (mongoose.models.Message as mongoose.Model<IMessage>)||model<IMessage>("Message", MessageSchema);
export default MessageModel;