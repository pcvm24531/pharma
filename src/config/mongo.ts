import "dotenv/config";
import connectToDataBase from "mongoose";

async function dbConnect(): Promise<void> {
    try {
        const DB_URI = process.env.DB_URI as string;
        await connectToDataBase(DB_URI);
        console.log('Connected to MongoDB database successfully!');        
    } catch (error) {
        console.error('Error connecting to MongoDB database:', error);
        process.exit(1);        
    }
}

export default dbConnect;
