import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Order } from '../entities/order.entity';

@Injectable()
export class InvoiceService {
    private readonly invoicesDir = path.join(process.cwd(), 'invoices');

    constructor() {
        // Create invoices directory if it doesn't exist
        if (!fs.existsSync(this.invoicesDir)) {
            fs.mkdirSync(this.invoicesDir, { recursive: true });
        }
    }

    async generateInvoice(order: Order): Promise<string> {
        const fileName = `invoice-${order.order_number}.pdf`;
        const filePath = path.join(this.invoicesDir, fileName);

        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(filePath);

                doc.pipe(stream);

                // Header
                doc.fontSize(20)
                    .text('INVOICE', { align: 'center' })
                    .moveDown();

                // Company/Store Info (customize as needed)
                doc.fontSize(10)
                    .text('Your Store Name', { align: 'right' })
                    .text('123 Business Street', { align: 'right' })
                    .text('City, State 12345', { align: 'right' })
                    .text('Email: info@yourstore.com', { align: 'right' })
                    .moveDown();

                // Invoice Details
                doc.fontSize(10)
                    .text(`Invoice Number: ${order.order_number}`, 50, 200)
                    .text(`Order Date: ${new Date(order.created_at).toLocaleDateString()}`)
                    .text(`Order Status: ${order.status}`)
                    .text(`Payment Method: ${order.payment_method}`)
                    .moveDown();

                // Customer Details
                doc.fontSize(12)
                    .text('Bill To:', { underline: true })
                    .fontSize(10)
                    .text(`Name: ${order.user.full_name}`)
                    .text(`Email: ${order.user.email}`)
                    .text(`Phone: ${order.phone}`)
                    .text(`Address: ${order.shipping_address}`)
                    .moveDown(2);

                // Table Header
                const tableTop = 350;
                doc.fontSize(10)
                    .font('Helvetica-Bold');

                doc.text('Item', 50, tableTop)
                    .text('Qty', 250, tableTop)
                    .text('Price', 320, tableTop)
                    .text('Total', 420, tableTop);

                // Draw line under header
                doc.moveTo(50, tableTop + 15)
                    .lineTo(550, tableTop + 15)
                    .stroke();

                // Table Items
                doc.font('Helvetica');
                let yPosition = tableTop + 30;

                order.items.forEach((item) => {
                    doc.text(item.product_name, 50, yPosition, { width: 180 })
                        .text(item.quantity.toString(), 250, yPosition)
                        .text(`$${Number(item.price).toFixed(2)}`, 320, yPosition)
                        .text(`$${Number(item.total).toFixed(2)}`, 420, yPosition);

                    yPosition += 25;
                });

                // Draw line before totals
                yPosition += 10;
                doc.moveTo(50, yPosition)
                    .lineTo(550, yPosition)
                    .stroke();

                // Totals
                yPosition += 20;
                doc.fontSize(10)
                    .text('Subtotal:', 350, yPosition)
                    .text(`$${Number(order.subtotal).toFixed(2)}`, 420, yPosition);

                yPosition += 20;
                doc.text('Tax:', 350, yPosition)
                    .text(`$${Number(order.tax).toFixed(2)}`, 420, yPosition);

                yPosition += 20;
                doc.text('Discount:', 350, yPosition)
                    .text(`-$${Number(order.discount).toFixed(2)}`, 420, yPosition);

                yPosition += 20;
                doc.fontSize(12)
                    .font('Helvetica-Bold')
                    .text('Total:', 350, yPosition)
                    .text(`$${Number(order.total).toFixed(2)}`, 420, yPosition);

                // Footer
                doc.fontSize(8)
                    .font('Helvetica')
                    .text(
                        'Thank you for your business!',
                        50,
                        700,
                        { align: 'center', width: 500 }
                    );

                doc.end();

                stream.on('finish', () => {
                    resolve(filePath);
                });

                stream.on('error', (error) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getInvoicePath(orderNumber: string): string {
        return path.join(this.invoicesDir, `invoice-${orderNumber}.pdf`);
    }
}
