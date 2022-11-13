import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
const AWSXRay = require("aws-xray-sdk");

const XAWS = AWSXRay.captureAWS(AWS);

// TODO: Implement the fileStogare logic

const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export function generateSignedUrl(imageId: string) {
  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration),
  });

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;

  return { uploadUrl, attachmentUrl };
}
