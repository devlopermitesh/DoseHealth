import mongoose from "mongoose";

type ConnectionType={
    isConnected?:number
}
const isConnection:ConnectionType={}
export const dbConnect = async ():Promise<void> => {
    if(isConnection.isConnected){
        console.log('db is already connected')
        return 
    }
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URI as string)
        isConnection.isConnected=connection.connections[0].readyState
        console.log('db is connected')
    } catch (error) {
     console.log("db connection error",error)
     process.exit(1)   

    }

}