const nodemailer = require('nodemailer');

const sendPropertyDetailMail = async (user, property) => {
    const { firstName, lastName, email } = user;
    const {
        name,
        image,
        place,
        area,
        bedrooms,
        bathrooms,
        hospitalsNearby,
        collegesNearby,
        likeCount
    } = property;

    const htmlMessage = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0066cc;">Property Details from Rentify</h2>
            <p>Dear ${firstName} ${lastName},</p>
            <p>We are pleased to share with you the details of the property you might be interested in:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Image:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><img src="${image}" alt="Property Image" style="width: 100%; max-width: 200px;" /></td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Place:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${place}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Area:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${area} sq.m</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Bedrooms:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${bedrooms}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Bathrooms:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${bathrooms}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Hospitals Nearby:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${hospitalsNearby.join(', ')}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Colleges Nearby:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${collegesNearby.join(', ')}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Likes:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${likeCount}</td>
                </tr>
            </table>
            <p>Best regards,<br />The Rentify Team</p>
        </div>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: 'rentify@gmail.com',
        to: email,
        subject: 'Property Details from Rentify',
        html: htmlMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendPropertyDetailMail;