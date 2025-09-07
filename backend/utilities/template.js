
export function welcome(result){
    const template = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                background-color: #4CAF50;
                padding: 20px;
                color: white;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 20px;
                font-size: 18px;
                color: white;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Welcome to Our Platform!
            </div>
            <div class="content">
                <p>Hi <strong>${result.fullname}</strong>,</p>
                <p>We are excited to have you on board. Your registered email is <strong>${result.email}</strong>. You can now explore all the amazing features we offer.</p>
                <p>Click the button below to log in and start your journey.</p>
                <a href="http://localhost:3000/v1/user/login" class="button">Login to Your Account</a>
            </div>
            <div class="footer">
                If you did not sign up for this account, please ignore this email or contact support.
            </div>
        </div>
    </body>
    </html>
    `
    return template;
  }
  export function otpMail(result){
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                background-color: #ff6600;
                padding: 20px;
                color: white;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .otp-code {
                display: inline-block;
                font-size: 22px;
                font-weight: bold;
                color: #ff6600;
                background: #fce4d6;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 10px;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                OTP Verification Required
            </div>
            <div class="content">
                <p>Hi <strong>${result.fullname}</strong>,</p>
                <p>To complete your verification, please use the OTP below. This code is valid for the next **10 minutes**.</p>
                <div class="otp-code">${result.otp}</div>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                Need help? Contact our support team.
            </div>
        </div>
    </body>
    </html>
    
    `
  
    return template
  }
  
  export function forgetPassword(result){
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                background-color: #007bff;
                padding: 20px;
                color: white;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .button {
                display: inline-block;
                background-color: #28a745;
                color: #ffffff;
                text-decoration: none;
                font-size: 18px;
                padding: 12px 24px;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
            }
            .button:hover {
                background-color: #218838;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Reset Your Password
            </div>
            <div class="content">
                <p>Hi <strong>${result.username}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="https://localhost/resetPassword-MusicApp.php?token=${result.token}" class="button">Reset Password</a>
                <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
                Need help? Contact our support team.
            </div>
        </div>
    </body>
    </html>
    `
    return template
  }
  
  export function orderReceipt(result){
    return `
    <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              margin: auto;
          }
          .header-bar {
              background-color: #4CAF50;
              color: white;
              padding: 15px;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              border-radius: 10px 10px 0 0;
          }
          .header {
              text-align: center;
              padding-bottom: 10px;
              margin-bottom: 20px;
          }
          .header h2 {
              color: #333;
          }
          .order-details, .sender-details, .receiver-details, .driver-details, .item-details {
              margin-bottom: 20px;
          }
          .order-details p, .sender-details p, .receiver-details p, .driver-details p, .item-details p {
              font-size: 16px;
              color: #555;
              margin: 5px 0;
          }
          .highlight {
              font-weight: bold;
              color: #333;
          }
          .thank-you {
              font-size: 18px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              margin-top: 10px;
          }
          .button-container {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              background-color: #4CAF50;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              border-radius: 5px;
              display: inline-block;
              transition: background 0.3s;
          }
          .button:hover {
              background-color: #45a049;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
  
      <div class="container">
          <!-- Company Header Bar -->
          <div class="header-bar">
              Cargo Ride - Your Trusted Delivery Partner
          </div>
  
          <div class="header">
              <h2>Order Receipt</h2>
              <p>Thank you for your purchase!</p>
          </div>
  
          <!-- Order Details -->
          <div class="order-details">
              <p><span class="highlight">Order Number:</span> #${result.orderSummary.order_number}</p>
              <p><span class="highlight">Order ID:</span> ${result.orderSummary.order_id}</p>
              <p><span class="highlight">Date:</span>${result.orderSummary.date}</p>
              <p><span class="highlight">POD:</span> ${result.orderSummary.pod}</p>
              <p><span class="highlight">Total Price:</span> ${result.orderSummary.total_price}</p>
              <p><span class="highlight">Delivery Status:</span> Delivered</p>
              <p><span class="highlight">Distance:</span> ${result.distanceAndTime.distance}</p>
              <p><span class="highlight">Estimated Time:</span> ${result.distanceAndTime.time}</p>
          </div>
  
          <!-- Location Details -->
          <div class="order-details">
              <p><span class="highlight">Pickup Location:</span> ${result.location.pickup}</p>
              <p><span class="highlight">Dropoff Location:</span> ${result.location.dropoff}</p>
          </div>
  
          <!-- Sender Details -->
          <div class="sender-details">
              <h3>Sender Details</h3>
              <p><span class="highlight">Name:</span> ${result.senderDetails.fullname}</p>
              <p><span class="highlight">Email:</span> ${result.senderDetails.email}</p>
              <p><span class="highlight">Phone:</span> ${result.senderDetails.phone}</p>
              <p><span class="highlight">Address:</span> Not Provided</p>
          </div>
  
          <!-- Receiver Details -->
          <div class="receiver-details">
              <h3>Receiver Details</h3>
              <p><span class="highlight">Name:</span> ${result.receiverDetails.fullname}</p>
              <p><span class="highlight">Email:</span> ${result.receiverDetails.email}</p>
              <p><span class="highlight">Phone:</span> ${result.receiverDetails.phone}</p>
              <p><span class="highlight">Address:</span> ${result.receiverDetails.address}</p>
          </div>
  
          <!-- Driver Details -->
          <div class="driver-details">
              <h3>Driver Details</h3>
              <p><span class="highlight">Name:</span> ${result.driverDetails.fullname}</p>
              <p><span class="highlight">Rating:</span> ⭐ (${result.driverDetails.rating} Stars)</p>
          </div>
  
          <!-- Items Details -->
          <div class="item-details">
              <h3>Item Details</h3>
              <p><span class="highlight">Item Type:</span> ${result.items[0].type}</p>
              <p><span class="highlight">Number of Items:</span> ${result.items[0].number}</p>
              <p><span class="highlight">Weight:</span> ${result.items[0].weight}</p>
              <p><span class="highlight">Unit:</span> ${result.items[0].unit}</p>
              <p><span class="highlight">Dimensions:</span> ${result.items[0].height} * ${result.items[0].width}</p>
              <p><span class="highlight">Notes:</span> ${result.items[0].notes}</p>
          </div>
  
          <!-- Thank You Message -->
          <div class="thank-you">
              🎉 We appreciate your trust in Cargo Ride! Wishing you a fantastic day! 🚚
          </div>
  
          <div class="button-container">
              <a href="#" class="button">Download Receipt</a>
          </div>
  
          <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
              <p>📞 Customer Support: +1-800-123-4567 | ✉️ support@cargoride.com</p>
          </div>
      </div>
  
  </body>
  </html>
    `
  }
  // exports.forgot_password = function(result, callback) {
  //         const template = `<!DOCTYPE html>
  //   <html xmlns="http://www.w3.org/1999/xhtml">
  //       <head>
  //         <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <title>Forgot Password</title>
    
  //           <style type="text/css">
  //               @media only screen and (max-width: 480px) {
  //               body,
  //               table,
  //               td,
  //               p,
  //               a,
  //               li,
  //               blockquote {
  //                   -webkit-text-size-adjust: none !important
  //               }
  //               body {
  //                   width: 100% !important;
  //                   min-width: 100% !important
  //               }
  //               td[id=bodyCell] {
  //                   padding: 10px !important
  //               }
  //               table.kmMobileHide {
  //                   display: none !important
  //               }
  //               table[class=kmTextContentContainer] {
  //                   width: 100% !important
  //               }
  //               table[class=kmBoxedTextContentContainer] {
  //                   width: 100% !important
  //               }
  //               td[class=kmImageContent] {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important
  //               }
  //               img[class=kmImage],
  //               img.kmImage {
  //                   width: 100% !important
  //               }
  //               td.kmMobileStretch {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important
  //               }
  //               table[class=kmSplitContentLeftContentContainer],
  //               table.kmSplitContentLeftContentContainer,
  //               table[class=kmSplitContentRightContentContainer],
  //               table.kmSplitContentRightContentContainer,
  //               table[class=kmColumnContainer],
  //               td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
  //               td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
  //               table[class=kmVerticalButton],
  //               table[class=kmVerticalButtonContent] {
  //                   width: 100% !important
  //               }
  //               td[class=kmButtonCollectionInner] {
  //                   padding-left: 9px !important;
  //                   padding-right: 9px !important;
  //                   padding-top: 9px !important;
  //                   padding-bottom: 0 !important;
  //                   background-color: transparent !important
  //               }
  //               td[class=kmVerticalButtonIconContent],
  //               td[class=kmVerticalButtonTextContent],
  //               td[class=kmVerticalButtonContentOuter] {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important;
  //                   padding-bottom: 9px !important
  //               }
  //               table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
  //               table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
  //               table[class=kmColumnContainer] td[class=kmTextContent],
  //               table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
  //               table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
  //               table.kmSplitContentLeftContentContainer td.kmImageContent,
  //               table.kmSplitContentRightContentContainer td.kmImageContent {
  //                   padding-top: 9px !important
  //               }
  //               td[class="rowContainer kmFloatLeft"],
  //               td.rowContainer.kmFloatLeft,
  //               td[class="rowContainer kmFloatLeft firstColumn"],
  //               td.rowContainer.kmFloatLeft.firstColumn,
  //               td[class="rowContainer kmFloatLeft lastColumn"],
  //               td.rowContainer.kmFloatLeft.lastColumn {
  //                   float: left;
  //                   clear: both;
  //                   width: 100% !important
  //               }
  //               table[class=templateContainer],
  //               table[class="templateContainer brandingContainer"],
  //               div[class=templateContainer],
  //               div[class="templateContainer brandingContainer"],
  //               table[class=templateRow] {
  //                   max-width: 600px !important;
  //                   width: 100% !important
  //               }
  //               h1 {
  //                   font-size: 24px !important;
  //                   line-height: 130% !important
  //               }
  //               h2 {
  //                   font-size: 20px !important;
  //                   line-height: 130% !important
  //               }
  //               h3 {
  //                   font-size: 18px !important;
  //                   line-height: 130% !important
  //               }
  //               h4 {
  //                   font-size: 16px !important;
  //                   line-height: 130% !important
  //               }
  //               td[class=kmTextContent] {
  //                   font-size: 14px !important;
  //                   line-height: 130% !important
  //               }
  //               td[class=kmTextBlockInner] td[class=kmTextContent] {
  //                   padding-right: 18px !important;
  //                   padding-left: 18px !important
  //               }
  //               table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
  //                   padding-left: 9px !important;
  //                   padding-right: 9px !important
  //               }
  //               table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
  //                   font-size: 14px !important;
  //                   line-height: 130% !important;
  //                   padding-left: 4px !important;
  //                   padding-right: 4px !important
  //               }
  //               }
  //           </style>
  //           <!--[if mso]>
  //           <style>
              
  //             .templateContainer {
  //               border: 1px none #aaaaaa;
  //               background-color: #FFFFFF;
                
  //             }
  //             #brandingContainer {
  //               background-color: transparent !important;
  //               border: 0;
  //             }
              
              
  //             .templateContainerInner {
  //               padding: 0px;
  //             }
              
  //           </style>
  //           <![endif]-->
  //       </head>
  //         <body style="margin:0;padding:0;background-color:#FFF">
  //           <center>
  //             <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
  //               <tbody>
  //                 <tr>
  //                   <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
  //                     <!--[if !mso]><!-->
  //                     <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
  //                       <div class="templateContainerInner" style="padding:0">
  //                         <!--<![endif]-->
  //                   <!--[if mso]>
  //                     <table border="0" cellpadding="0" cellspacing="0" class="templateContainer"  width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                     <tbody>
  //                       <tr>
  //                         <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                           <![endif]-->
  //                           <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                             <tr>
  //                               <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                 <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                   <tbody>
  //                                     <tr>
  //                                       <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                         <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                           <tbody class="kmTextBlockOuter">
  //                                             <tr>
  //                                               <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                                   <tbody>
  //                                                     <tr>
  //                                                       <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
  //                                                       </td>
  //                                                     </tr>
  //                                                   </tbody>
  //                                                 </table>
  //                                               </td>
  //                                             </tr>
  //                                           </tbody>
  //                                         </table>
                                          
  //                                         <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                           <tbody class="kmTextBlockOuter">
  //                                             <tr>
  //                                               <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                                   <tbody>
  //                                                     <tr>
  //                                                       <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
  //                                                         <span style="color:#000000;"></span>
  //                                                         <!-- Your Content As below -->
  //                                                         <p style="margin:0;padding-bottom:1em;text-align: justify;"><span style="font-size:16px;"><span style="color: rgb(0, 0, 0);"><span style="font-family: arial,helvetica,sans-serif;"></span></span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Dear <strong>${result.first_name}</strong>,</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Please use below link to change your password!</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"> </p>
                                                          
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Click Here To Change Your Password:&nbsp;&nbsp;&nbsp;<a href="${result.url}" target="_blank" style="word-wrap:break-word;color:#0000cd;font-weight:normal;text-decoration:underline">Change Password</a></span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Do not share your password to anyone.</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"> </p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Thank you,</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:0"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">${globals.app_name} Team</span></span></p>
  //                                                       </td>
  //                                                     </tr>
  //                                                   </tbody>
  //                                                 </table>
  //                                               </td>
  //                                             </tr>
  //                                           </tbody>
  //                                         </table>
  //                                       </td>
  //                                     </tr>
  //                                   </tbody>
  //                                 </table>
  //                               </td>
  //                             </tr>
  //                           </table>
  //                           <!--[if !mso]><!-->
  //                         </div>
  //                       </div>
  //                   </td>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </center>
  //         </body>
  //     </html>
  //     `;
  //         callback(template);
  //     },
  
  //     exports.contactUs = function(result, callback) {
  //         const template = `<!DOCTYPE html>
  //   <html xmlns="http://www.w3.org/1999/xhtml">
  //       <head>
  //         <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <title>Enquiry Details</title>
    
  //           <style type="text/css">
  //               @media only screen and (max-width: 480px) {
  //               body,
  //               table,
  //               td,
  //               p,
  //               a,
  //               li,
  //               blockquote {
  //                   -webkit-text-size-adjust: none !important
  //               }
  //               body {
  //                   width: 100% !important;
  //                   min-width: 100% !important
  //               }
  //               td[id=bodyCell] {
  //                   padding: 10px !important
  //               }
  //               table.kmMobileHide {
  //                   display: none !important
  //               }
  //               table[class=kmTextContentContainer] {
  //                   width: 100% !important
  //               }
  //               table[class=kmBoxedTextContentContainer] {
  //                   width: 100% !important
  //               }
  //               td[class=kmImageContent] {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important
  //               }
  //               img[class=kmImage],
  //               img.kmImage {
  //                   width: 100% !important
  //               }
  //               td.kmMobileStretch {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important
  //               }
  //               table[class=kmSplitContentLeftContentContainer],
  //               table.kmSplitContentLeftContentContainer,
  //               table[class=kmSplitContentRightContentContainer],
  //               table.kmSplitContentRightContentContainer,
  //               table[class=kmColumnContainer],
  //               td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
  //               td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
  //               table[class=kmVerticalButton],
  //               table[class=kmVerticalButtonContent] {
  //                   width: 100% !important
  //               }
  //               td[class=kmButtonCollectionInner] {
  //                   padding-left: 9px !important;
  //                   padding-right: 9px !important;
  //                   padding-top: 9px !important;
  //                   padding-bottom: 0 !important;
  //                   background-color: transparent !important
  //               }
  //               td[class=kmVerticalButtonIconContent],
  //               td[class=kmVerticalButtonTextContent],
  //               td[class=kmVerticalButtonContentOuter] {
  //                   padding-left: 0 !important;
  //                   padding-right: 0 !important;
  //                   padding-bottom: 9px !important
  //               }
  //               table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
  //               table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
  //               table[class=kmColumnContainer] td[class=kmTextContent],
  //               table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
  //               table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
  //               table.kmSplitContentLeftContentContainer td.kmImageContent,
  //               table.kmSplitContentRightContentContainer td.kmImageContent {
  //                   padding-top: 9px !important
  //               }
  //               td[class="rowContainer kmFloatLeft"],
  //               td.rowContainer.kmFloatLeft,
  //               td[class="rowContainer kmFloatLeft firstColumn"],
  //               td.rowContainer.kmFloatLeft.firstColumn,
  //               td[class="rowContainer kmFloatLeft lastColumn"],
  //               td.rowContainer.kmFloatLeft.lastColumn {
  //                   float: left;
  //                   clear: both;
  //                   width: 100% !important
  //               }
  //               table[class=templateContainer],
  //               table[class="templateContainer brandingContainer"],
  //               div[class=templateContainer],
  //               div[class="templateContainer brandingContainer"],
  //               table[class=templateRow] {
  //                   max-width: 600px !important;
  //                   width: 100% !important
  //               }
  //               h1 {
  //                   font-size: 24px !important;
  //                   line-height: 130% !important
  //               }
  //               h2 {
  //                   font-size: 20px !important;
  //                   line-height: 130% !important
  //               }
  //               h3 {
  //                   font-size: 18px !important;
  //                   line-height: 130% !important
  //               }
  //               h4 {
  //                   font-size: 16px !important;
  //                   line-height: 130% !important
  //               }
  //               td[class=kmTextContent] {
  //                   font-size: 14px !important;
  //                   line-height: 130% !important
  //               }
  //               td[class=kmTextBlockInner] td[class=kmTextContent] {
  //                   padding-right: 18px !important;
  //                   padding-left: 18px !important
  //               }
  //               table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
  //                   padding-left: 9px !important;
  //                   padding-right: 9px !important
  //               }
  //               table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
  //                   font-size: 14px !important;
  //                   line-height: 130% !important;
  //                   padding-left: 4px !important;
  //                   padding-right: 4px !important
  //               }
  //               }
  //           </style>
  //           <!--[if mso]>
  //           <style>
              
  //             .templateContainer {
  //               border: 1px none #aaaaaa;
  //               background-color: #FFFFFF;
                
  //             }
  //             #brandingContainer {
  //               background-color: transparent !important;
  //               border: 0;
  //             }
              
              
  //             .templateContainerInner {
  //               padding: 0px;
  //             }
              
  //           </style>
  //           <![endif]-->
  //       </head>
  //         <body style="margin:0;padding:0;background-color:#FFF">
  //           <center>
  //             <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
  //               <tbody>
  //                 <tr>
  //                   <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
  //                     <!--[if !mso]><!-->
  //                     <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
  //                       <div class="templateContainerInner" style="padding:0">
  //                         <!--<![endif]-->
  //                   <!--[if mso]>
  //                     <table border="0" cellpadding="0" cellspacing="0" class="templateContainer"  width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                     <tbody>
  //                       <tr>
  //                         <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                           <![endif]-->
  //                           <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                             <tr>
  //                               <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                 <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                   <tbody>
  //                                     <tr>
  //                                       <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                         <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                           <tbody class="kmTextBlockOuter">
  //                                             <tr>
  //                                               <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                                   <tbody>
  //                                                     <tr>
  //                                                       <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
  //                                                       </td>
  //                                                     </tr>
  //                                                   </tbody>
  //                                                 </table>
  //                                               </td>
  //                                             </tr>
  //                                           </tbody>
  //                                         </table>
                                          
  //                                         <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                           <tbody class="kmTextBlockOuter">
  //                                             <tr>
  //                                               <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
  //                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
  //                                                   <tbody>
  //                                                     <tr>
  //                                                       <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
  //                                                         <span style="color:#000000;"></span>
  //                                                         <!-- Your Content As below -->
  //                                                         <p style="margin:0;padding-bottom:1em;text-align: justify;"><span style="font-size:16px;"><span style="color: rgb(0, 0, 0);"><span style="font-family: arial,helvetica,sans-serif;"></span></span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Dear <strong> Host </strong>,</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Please check below customer enquiry details</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"> </p>
                                                          
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Customer Name : ${result.name} </span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Customer Email : ${result.email} </span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Message : ${result.message} </span></span></p>
  //                                                         <p style="margin:0;padding-bottom:1em"> </p>
  //                                                         <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Thank you,</span></span></p>
  //                                                         <p style="margin:0;padding-bottom:0"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">${globals.app_name} Team</span></span></p>
  //                                                       </td>
  //                                                     </tr>
  //                                                   </tbody>
  //                                                 </table>
  //                                               </td>
  //                                             </tr>
  //                                           </tbody>
  //                                         </table>
  //                                       </td>
  //                                     </tr>
  //                                   </tbody>
  //                                 </table>
  //                               </td>
  //                             </tr>
  //                           </table>
  //                           <!--[if !mso]><!-->
  //                         </div>
  //                       </div>
  //                   </td>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </center>
  //         </body>
  //     </html>
  //     `;
  //         callback(template);
  //     }
  
  
  
  
  
  
  // // https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module