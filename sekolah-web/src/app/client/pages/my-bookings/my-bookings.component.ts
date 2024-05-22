import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientService } from '../../services/client.service';
import { CompanyService } from 'src/app/company/services/company.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent {

   OrderProduct: any[] = [];
  booking: any;



  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.getMyBookings();
  }

  getMyBookings() {
    this.clientService.getMyBookings().subscribe(
      res => {
        this.processBookingsData(res);
        this.OrderProduct.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // agar postingan berada diatas ketika tanggal dibuat duluan
      },
      error => {
        this.notification.error(
          'ERROR',
          'Gagal mendapatkan data pemesanan: ' + error.message,
          { nzDuration: 5000 }
        );
      }
    );

  }

processBookingsData(bookings: any[]) {
  this.OrderProduct = bookings.map(item => {
    item.amount = item.amount ? item.amount : null;
 

    return item;
    
  })
}


  deleteBooking(bookingId: number) {
    this.clientService.deleteBooking(bookingId).subscribe(
      () => {
        this.notification.success('SUCCESS', 'Pemesanan berhasil dibatalkan', { nzDuration: 5000 });
        this.getMyBookings(); // Refresh bookings after deletion
      },
      error => {
        this.notification.error('ERROR', 'Gagal menghapus pemesanan: ' + error.message, { nzDuration: 5000 });
      }
    );
  }


  



downloadAllInvoices(): void {
  // Get all bookings without filtering by status
  const allBookings = this.OrderProduct;


  // Get customer name and transaction ID from the first booking
  const firstBooking = allBookings[0];
  const customerName = firstBooking.userName.toUpperCase(); // Convert customer name to uppercase
  const bookingId = firstBooking.id;

  // Start HTML template
  let allInvoicesContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bukti Booking</title>
      <style>
        body {
          margin: 60px 160px;
          background-color: #f7f7ff;
        }
        #invoice {
          padding: 0px;
        }
        table, th, td {
          text-align: center;
        }
        .invoice {
          position: relative;
          background-color: #FFF;
          min-height: 680px;
          padding: 15px;
        }
        .invoice header {
          padding: 10px 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #0d6efd;
        }
        .invoice .company-details {
          text-align: right;
        }
        .invoice .company-details .name {
          margin-top: 0;
          margin-bottom: 0;
        }
        .invoice .contacts {
          margin-bottom: 20px;
        }
        .invoice .invoice-to {
          text-align: left;
        }
        .invoice .invoice-to .to {
          margin-top: 0;
          margin-bottom: 0;
        }
        .invoice .invoice-details {
          text-align: right;
        }
        .invoice .invoice-details .invoice-id {
          margin-top: 0;
          color: #0d6efd;
        }
        .invoice main {
          padding-bottom: 50px;
        }
        .invoice main .thanks {
          margin-top: -100px;
          font-size: 2em;
          margin-bottom: 50px;
        }
        .invoice main .notices {
          padding-left: 6px;
          border-left: 6px solid #0d6efd;
          background: #e7f2ff;
          padding: 10px;
        }
        .invoice main .notices .notice {
          font-size: 1.2em;
        }
        .invoice table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          margin-bottom: 20px;
        }
        .invoice table td,
        .invoice table th {
          padding: 15px;
          background: #eee;
          border-bottom: 1px solid #fff;
          text-align: center;
        }
        .invoice table th {
          white-space: nowrap;
          font-weight: 400;
          font-size: 16px;
        }
        .invoice table td h3 {
          margin: 0;
          font-weight: 400;
          color: #0d6efd;
          font-size: 1.2em;
        }
        .invoice table .total {
          text-align: right;
          font-size: 1.2em;
        }
        .invoice table .qty,
        .invoice table .unit {
          text-align: center;
          font-size: 1.2em;
        }
        .invoice table .no {
          color: #fff;
          font-size: 1.6em;
          background: #0d6efd;
        }
        .invoice table .unit {
          background: #ddd;
        }
        .invoice table .total {
          background: #0d6efd;
          color: #fff;
        }
        .invoice table tbody tr:last-child td {
          border: none;
        }
        .invoice table tfoot td {
          background: 0 0;
          border-bottom: none;
          white-space: nowrap;
          text-align: right;
          padding: 10px 10px;
          font-size: 1.2em;
          border-top: 1px solid #aaa;
        }
        .invoice table tfoot tr:first-child td {
          border-top: none;
        }
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          word-wrap: break-word;
          background-color: #fff;
          background-clip: border-box;
          border: 0px solid rgba(0, 0, 0, 0);
          border-radius: .25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
        }
        .invoice table tfoot tr:last-child td {
          color: #0d6efd;
          font-size: 1.4em;
          border-top: 1px solid #0d6efd;
        }
        .invoice table tfoot tr td:first-child {
          border: none;
        }
        .invoice footer {
          width: 100%;
          text-align: center;
          color: #777;
          border-top: 1px solid #aaa;
          padding: 8px 0;
        }
        @media print {
          .invoice {
            font-size: 11px !important;
            overflow: hidden !important;
          }
          .invoice footer {
            position: absolute;
            bottom: 10px;
            page-break-after: always;
          }
          .invoice > div:last-child {
            page-break-before: always;
          }
        }
        .invoice main .notices {
          padding-left: 6px;
          border-left: 6px solid #0d6efd;
          background: #e7f2ff;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <!-- Start of invoice template -->
      <div class="invoice">
        <header>
          <div class="row">
            <div class="col">
              <a href="javascript:;">
                <img src="assets/images/logo-icon.png" width="80" alt="">
              </a>
            </div>
            <div class="col company-details">
              <h2 class="name">
                <a target="_blank" href="javascript:;">
                  Bagus
                </a>
              </h2>
              <div>Jl. jalan apa aja</div>
              <div>(123) 011-000</div>
              <div>bagus@example.com</div>
            </div>
          </div>
        </header>
        <main>
          <!-- Transaction and customer information -->
          <div class="row contacts">
            <div class="col invoice-to">
              <div class="text-gray-light">Kwitansi Untuk:</div>
              <h3 class="to text-uppercase">${customerName}</h3>
            </div>
            <div class="col invoice-details">
              <h1 class="invoice-id">ID-${bookingId}</h1>
            </div>
          </div>
          <!-- Transaction detail table -->
          <table>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Nama Produk</th>
                <th class="text-center">Harga Satuan</th>
                <th class="text-center">Jumlah Pesanan</th>
                <th class="text-center">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loop through all bookings and add invoice details -->
              ${this.generateInvoiceRows(allBookings)}
            </tbody>
          </table>
          <!-- Thank you message and notice -->
          <div class="notices">
            <div>Pemberitahuan:</div>
            <div class="notice">Silahkan Menunjukan ini ke kasir untuk melanjutkan pembayaran</div>
          </div>
        </main>
        <footer>Desain by Bootdey.com</footer>
      </div>
    </body>
    </html>
  `;

  // Open a new window to display the complete invoice
  const newWindow = window.open('', '_blank');
  newWindow.document.write(allInvoicesContent);
}

generateInvoiceRows(bookings): string {
  let rows = '';

  bookings.forEach((booking, index) => {
   

    rows += `
      <tr>
        <td class="no text-center">${index + 1}</td>
        <td class="text-center">${booking.nameProduct}</td>
        <td class="text-center text-uppercase">${booking.amount}</td>
      </tr>
    `;
  });



  return rows;
}




}
