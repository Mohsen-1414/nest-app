// pdf.service.ts

import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { ProductDocument } from 'src/product/schema/product.schema';
import { CartDocument } from './schema/cart.schema';
import { UserDocument } from '../user/schema/user.schema';
import { CartItemDocument } from './schema/cart-item.schema';

 
@Injectable()
export class PdfService {
  constructor(){}
  generateReport(products: ProductDocument[], cart: CartDocument, user: UserDocument, cartItems: CartItemDocument[]): void {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('report.pdf'));

    // Add content to the PDF document
    doc.text('Shoping Report');
    doc.text('------------------------------------------');

    // User Information
    doc.text(`User Information:`);
    doc.text(`Username: ${user.username}`);
    doc.text(`Email: ${user.email}`);
    doc.text('------------------------------------------');

    // Cart Information
    doc.text(`Cart Information:`);
    if (cart.items.length > 0) {
      cartItems.forEach((item, index) => {
        const product = products.find(prod => prod._id.equals(item.productId));
        if (product) {
          doc.text(`Item ${index + 1}:`);
          doc.text(`Product Title: ${product.title}`);
          doc.text(`Quantity: ${item.quantity}`);
          doc.text('------------------------------------------');
        }
      });
    } else {
      doc.text('No items in the cart.');
    }

    // End the document
    doc.end();
  }
}
