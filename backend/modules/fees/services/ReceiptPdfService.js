const fs =
require("fs");

const path =
require("path");

const PDFDocument =
require("pdfkit");

const QRCode =
require("qrcode");

const Receipt =
require(
  "../models/Receipt"
);



// ======================
// GENERATE PDF
// ======================

const generateReceiptPdf =
async (receiptId) => {

  try {

    // ======================
    // RECEIPT
    // ======================

    const receipt =
      await Receipt.findById(
        receiptId
      );

    if (!receipt) {

      throw new Error(
        "Receipt not found"
      );
    }



    // ======================
    // FILE NAME
    // ======================

    const fileName =

      `${receipt.receiptNumber}.pdf`;



    const filePath =
      path.join(

        __dirname,

        "../../../uploads/receipts",

        fileName
      );



    // ======================
    // PDF DOC
    // ======================

    const doc =
      new PDFDocument({

        margin: 40
      });



    const stream =
      fs.createWriteStream(
        filePath
      );



    doc.pipe(stream);




    // ======================
    // HEADER
    // ======================

    doc

    .fontSize(22)

    .text(

      "SOFTZEN ERP",

      {

        align: "center"
      }
    );



    doc.moveDown(0.5);



    doc

    .fontSize(14)

    .text(

      "School Fee Receipt",

      {

        align: "center"
      }
    );



    doc.moveDown(2);




    // ======================
    // RECEIPT DETAILS
    // ======================

    doc

    .fontSize(12)

    .text(

      `Receipt No: ${receipt.receiptNumber}`
    );



    doc.text(

      `Date: ${new Date(
        receipt.createdAt
      ).toLocaleDateString()}`
    );



    doc.text(

      `Transaction ID: ${receipt.transactionId}`
    );



    doc.moveDown();




    // ======================
    // STUDENT DETAILS
    // ======================

    doc

    .fontSize(14)

    .text(
      "Student Details"
    );



    doc.moveDown(0.5);



    doc

    .fontSize(12)

    .text(

      `Student Name: ${receipt.studentSnapshot.studentName}`
    );



    doc.text(

      `Admission No: ${receipt.studentSnapshot.admissionNumber}`
    );



    doc.text(

      `Class: ${receipt.studentSnapshot.className}`
    );



    doc.text(

      `Section: ${receipt.studentSnapshot.section}`
    );



    doc.text(

      `Parent Name: ${receipt.studentSnapshot.parentName}`
    );



    doc.moveDown(1.5);




    // ======================
    // FEE ITEMS
    // ======================

    doc

    .fontSize(14)

    .text(
      "Fee Details"
    );



    doc.moveDown(0.5);



    receipt.feeItems.forEach(
      (item) => {

        doc

        .fontSize(12)

        .text(

          `${item.title} - ₹${item.amount}`
        );
      }
    );



    doc.moveDown(1);




    // ======================
    // TOTALS
    // ======================

    doc

    .fontSize(12)

    .text(

      `Subtotal: ₹${receipt.subtotal}`
    );



    doc.text(

      `Discount: ₹${receipt.discountAmount}`
    );



    doc.text(

      `Fine: ₹${receipt.fineAmount}`
    );



    doc.text(

      `Paid Amount: ₹${receipt.amountPaid}`
    );



    doc.text(

      `Pending Amount: ₹${receipt.pendingAmount}`
    );



    doc.moveDown(2);




    // ======================
    // QR CODE
    // ======================

    const qrImage =
      await QRCode.toDataURL(

        receipt.qrCodeData
      );



    const base64Data =
      qrImage.replace(

        /^data:image\/png;base64,/,

        ""
      );



    const qrBuffer =
      Buffer.from(

        base64Data,

        "base64"
      );



    doc.image(

      qrBuffer,

      {

        fit: [100, 100],

        align: "center"
      }
    );



    doc.moveDown();




    // ======================
    // FOOTER
    // ======================

    doc

    .fontSize(10)

    .text(

      "This is a system generated receipt.",

      {

        align: "center"
      }
    );



    doc.end();




    // ======================
    // WAIT
    // ======================

    await new Promise(

      (resolve, reject) => {

        stream.on(
          "finish",
          resolve
        );

        stream.on(
          "error",
          reject
        );
      }
    );



    // ======================
    // UPDATE RECEIPT
    // ======================

    receipt.pdfUrl =

      `/uploads/receipts/${fileName}`;

    await receipt.save();



    return {

      success: true,

      pdfUrl:
        receipt.pdfUrl
    };

  } catch (error) {

    console.error(

      "PDF GENERATION ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  generateReceiptPdf
};