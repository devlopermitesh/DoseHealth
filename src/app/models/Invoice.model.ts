import mongoose,{model,mongo,Schema, StringSchemaDefinition} from "mongoose"
type Items_type={
    _id:string,
    description:string,
    qualitity:number,
    price:number,
    total:number
}
enum PaymentStatus {
    paid = "paid",
    unpaid = "unpaid",
    partially_paid = "partially_paid",
  }
enum Payment_method{
Cash="Cash",
Credit_card="Credit Card",
onlineTransfer="Online Transfer",
Insurance="Insurance"
}
export interface Invoice extends Document{
invoice_id:string,
invoice_number:string,
userId:mongoose.Schema.Types.ObjectId,
appointmentId:mongoose.Schema.Types.ObjectId,
doctor:mongoose.Schema.Types.ObjectId,
items:Items_type[],
subtotal:number,
tax:number//amount of tax will be add
discount:number//amout of discount will be less
payment_status:PaymentStatus,
invoice_date:Date,
information:string,
Total:number
payment_method:Payment_method

}


const itemSchema:Schema<Items_type>=new Schema({
description:{
    type:String,
    required:true,
},
qualitity:{
    required:true,
    type:Number
},
price:{
    type:Number,
    required:true    
},
total:{
    type:Number,
    required:true
}
})

const InvoiceSchema=new Schema({
    invoice_number:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    items:[itemSchema],
    subtotal:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    payment_status:{
        type:String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.unpaid,
        required:true
    },
    invoice_date:{
        type:Date,
        default:Date.now,
        required:true
    },
    information:{
        type:String,
        required:false
    },
    Total:{
        type:Number,
        required:true
    },
    payment_method:{
        type:String,
        enum: Object.values(Payment_method),
        default: Payment_method.onlineTransfer,
        required:true
    }
})

const InvoiceModel=(mongoose.models.Invoice as mongoose.Model<Invoice>)||model<Invoice>("Invoice",InvoiceSchema)
export default InvoiceModel