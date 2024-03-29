

const crypto = require("crypto");
const res = require("express/lib/response");

const generateKey = async (req, res, next) => {
   const {modulusLength} = req.body
   console.log(modulusLength);

   const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: Number(modulusLength),
      publicKeyEncoding : {
         type: "pkcs1",
         format: "pem",
      },
      privateKeyEncoding : {
         type: "pkcs1",
         format: "pem",
      }
   })
   console.log(publicKey, privateKey);
   res.status(200).json({ publicKey, privateKey });
}

const encode = async (req, res, next) => {
   const {publicKey, data} = req.body

   const encryptedData = crypto.publicEncrypt(
      {
         key: publicKey,
         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
         oaepHash: "sha256",
      },
      
      Buffer.from(data)
   )
   console.log(encryptedData);
   console.log("encypted data: ", encryptedData.toString("base64"))


   res.status(200).json({
      encryptedDataStr : encryptedData.toString("base64"),// string
      encryptedData// obj 
   })

}

const decode = async (req, res, next) => {
   const {encryptedData, privateKey, encryptedDataStr} = req.body
   const convertedBuffer  = Buffer.from(encryptedData).toString("base64")
   if(convertedBuffer != encryptedDataStr) {
      throw new Error
   }
   const decryptedData = crypto.privateDecrypt(
      {
         key: privateKey,
         
         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
         oaepHash: "sha256",
      },
      Buffer.from(encryptedData)
      )
   
   // console.log(typeof(Buffer.from(encryptedData)))


   res.status(200).json(decryptedData.toString())

}
module.exports = {
   encode,
   decode,
   generateKey
}