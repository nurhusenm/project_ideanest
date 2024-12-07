import mongoose from "mongoose";

let isCOnnected = false; //track the connection

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isCOnnected) {
    console.log("mongodb is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      // useNewUriParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000,
    });
    isCOnnected = true;

    console.log("mongodb connected");
  } catch (error) {
    console.log(error);
  }
};
