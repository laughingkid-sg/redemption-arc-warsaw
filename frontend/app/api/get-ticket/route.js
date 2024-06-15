import AWS from "aws-sdk";
import nodemailer from "nodemailer"

const USERNAME = process.env.NODEMAILER_EMAIL
const PW = process.env.NODEMAILER_PW

export const POST = async (req) => {
    const { contractAddress, tokenId, userEmail } = await req.json();
    AWS.config.update({ 
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION 
    });
    const s3 = new AWS.S3();

    const awsParams = {
        Bucket: "nfticket-codes",
        Key: `${contractAddress}_${tokenId}.pdf`, 
    };

    try {
        const signedUrl = s3.getSignedUrl('getObject', awsParams);

        console.log("Signed URL: ", signedUrl);

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: USERNAME,
                pass: PW,
            },
        });

        var mailOptions = {
            from: USERNAME,
            to: userEmail,
            subject: "Here is your NFTicket!",
            html: `<h3 style="color: black;">Please click on the url below to find the PDF file to your ticket:</h3>
            <a href="${signedUrl}">Access your ticket</a>
            <div style="color: black;">DO NOT share this link or PDF with others.</div>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              throw new Error(error);
            } else {
              console.log("Email Sent");
              return true;
            }
        }); 

        return new Response(JSON.stringify(signedUrl), {status: 200})
    } catch (err) {
        console.error("Error generating signed URL: ", err);
        return new Response(JSON.stringify("Failed to generate signed URL"), {status: 200})
    }
}