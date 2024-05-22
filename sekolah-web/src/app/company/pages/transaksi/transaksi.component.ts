import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.scss']
})
export class TransaksiComponent {
  bookings: any;
  originalBookings: any[]; // Menyimpan salinan data asli
  validateForm!: FormGroup;
  userId: string; // Atau sesuaikan tipe data sesuai kebutuhan Anda

  constructor(
    private companyService: CompanyService,
    private notification: NzNotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}


    ngOnInit() {
    this.validateForm = this.fb.group({
      service: [null, [Validators.required]],
    });
    this.getAllAdBookingsGroupedByUserId();
  }

  getAllAdBookingsGroupedByUserId() {
    this.companyService.getAllAdBookingsGroupedByUserId().subscribe(res => {
      // Ubah notes dan amount ke objek 
      this.originalBookings = res.map(item => ({ ...item }));

      


      this.bookings = this.originalBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }


generateReceipt(booking: any) {
  // Ambil nama pelanggan dan ID transaksi dari transaksi pertama yang disetujui
  const customerName = booking.userName.toUpperCase(); // Konversi nama pelanggan menjadi huruf besar
  const bookingId = booking.id;

  // Mulai template HTML
  let receiptContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kwitansi</title>
      <style>
        body {
          margin: 60px 160px;
          background-color: #f7f7ff;
          font-family: Arial, sans-serif;
        }

        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          margin-bottom: 20px;
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .receipt-header img {
          width: 80px;
        }

        .company-details {
          text-align: right;
        }

        .company-details h2 {
          margin: 0;
          font-size: 24px;
          color: #0d6efd;
        }

        .company-details div {
          margin-bottom: 5px;
        }

        .invoice-details h1 {
          margin: 0;
          font-size: 24px;
          color: #0d6efd;
        }

        .invoice-details .invoice-id {
          margin-top: 10px;
        }

        .customer-details {
          margin-bottom: 20px;
        }

        .customer-details h3 {
          margin: 0;
          font-size: 20px;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .invoice-table th, .invoice-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }

        .invoice-table th {
          background-color: #153448;
          color: white;
          text-align: center;
        }

        .invoice-table td {
          text-align: center;
        }

        .total-payment {
          font-size: 20px;
          font-weight: bold;
          text-align: right;
        }

        .notices {
          background-color: #e7f2ff;
          border-left: 6px solid #0d6efd;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="receipt-header">
          <div>
          </div>
          <div class="company-details">
            <h2>Bagus</h2>
            <div>Jl. jalan apa aja</div>
            <div>(123) 011-000</div>
            <div>bagus@example.com</div>
          </div>
        </div>
        <div class="invoice-details">
        </div>
        <div class="customer-details">
          <h3>Kwitansi Untuk:</h3>
          <div>${customerName}</div>
        </div>
        <table class="invoice-table">
          <thead>
            <tr>
           <th class="text-center">No</th>
                <th class="text-center">Nama Produk</th>
                <th class="text-center">Jumlah Pinjaman</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateReceiptRows(booking)}
            
          </tbody>
        </table>
       
        <div class="notices">
          <div><strong>Pemberitahuan:</strong></div>
          <div>Silahkan tunjukkan ini ke kasir untuk melanjutkan pembayaran.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Tampilkan konten kwitansi
  const newWindow = window.open('', '_blank');
  newWindow.document.write(receiptContent);
}


generateReceiptRows(booking: any): string {
  let rows = '';

  booking.reservations.forEach((reservation: any, index: number) => {
    const { nameProduct, amount, } = reservation;
    const rowNumber = index + 1;

    rows += `
      <tr>
        <td>${rowNumber}</td>
        <td>${nameProduct}</td>
        <td>${amount}</td>
      </tr>
    `;
  });

  

  return rows;
}





}
