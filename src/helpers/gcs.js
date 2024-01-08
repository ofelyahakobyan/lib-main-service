import  {Storage}  from '@google-cloud/storage';

class GCS {
  // UPLOAD file to google cloud
  static  async  upload(bucket, file, destinationFileName) {
    const options = {destination: destinationFileName, contentType:file.mimetype};
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      keyFilename: process.env.KEY_FILE_NAME
    });
    return await storage.bucket(bucket).file(destinationFileName).save(file.buffer, options);
  }
  // DELETE file from google cloud
  static async delete(bucket, file){
   // const options={ifGenerationMatch: generationMatchPrecondition};
    const storage = new Storage({
      projectId: process.env.GOOGLE_PROJECT_ID,
      keyFilename: process.env.KEY_FILE_NAME
    });
    storage.bucket(bucket).file(file).delete().catch(er=>console.error(er));

  }
}

export default GCS;