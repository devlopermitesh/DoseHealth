import cloudinary from "../lib/cloudinary";

export const uploadToCloudinary = async (file: File, folder: string): Promise<any> => {
  try {
    // Convert file to a buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Create a promise to handle the upload process
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Allows auto-detection of file type
          folder: folder, // Target folder in Cloudinary
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(error);
          }
          // console.log("Cloudinary Upload Result:", result);
          return resolve(result); // Resolve with the result of the upload
        }
      ).end(bytes); // Pass the bytes to the upload stream
    });
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw error;
  }
};