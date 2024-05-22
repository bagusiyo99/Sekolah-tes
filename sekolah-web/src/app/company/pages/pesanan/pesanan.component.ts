import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from '../../services/company.service';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pesanan',
  templateUrl: './pesanan.component.html',
  styleUrls: ['./pesanan.component.scss']
})
export class PesananComponent {
  bookings: any;
  originalBookings: any[]; // Menyimpan salinan data asli
  validateForm!: FormGroup;
  searchDate: Date;

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
    this.getAllAdBookings();
  }

  getAllAdBookings() {
    this.companyService.getAllAdBookings().subscribe(res => {
      // Ubah notes dan amount ke objek 
      this.originalBookings = res.map(item => ({ ...item }));


      // Urutkan data berdasarkan notes dalam urutan menurun (descending)
      this.bookings = this.originalBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    });
  }



  searchAdByName() {
    const searchTerm = this.validateForm.get('service').value.toLowerCase(); // Dapatkan nilai pencarian nameProduct dan ubah ke huruf kecil
    
    // Lakukan pemanggilan ke server untuk mencari pemesanan berdasarkan searchTerm
    this.companyService.getAllAdBookings().subscribe(
      res => {
        // Filter data iklan berdasarkan pencarian pengguna
        this.bookings = res.filter(booking => booking.nameProduct.toLowerCase().includes(searchTerm));
        
        // Tambahkan logika lain sesuai kebutuhan

        // Jika tidak ada hasil yang ditemukan, tampilkan notifikasi
        if (this.bookings.length === 0) {
          this.notification.warning(
            'Peringatan',
            'Tidak ada data yang ditemukan untuk pencarian Anda',
            { nzDuration: 5000 }
          );
        }
      },
      error => {
        // Penanganan kesalahan
        console.error('Gagal mencari iklan:', error);
        this.notification.error(
          'ERROR',
          'Gagal mencari data',
          { nzDuration: 5000 }
        );
      }
    );
  }

  
 

  exportToExcel(): void {
    // Filter data hanya untuk pemesanan yang disetujui

    // Data yang akan diekspor
    const data = this.bookings.map(booking => ({
      'Nama Client': booking.userName,
      'Ruangan': booking.nameProduct,
      'Jumlah Pinjaman ': booking.amount,
    }));

    // Konversi data ke format yang sesuai untuk file Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Buat file Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Pendapatan');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }



  searchByDate(): void {
    if (!this.searchDate) {
      // Jika tanggal pencarian tidak ditentukan, tampilkan semua pemesanan
      this.bookings = this.originalBookings; // Gunakan data asli
      return;
    }

    // Lakukan pencarian berdasarkan tanggal check-in yang cocok dengan tanggal pencarian
    this.bookings = this.originalBookings.filter(booking =>
      new Date(booking.createdAt).getDate() === this.searchDate.getDate()
    );

    // Tampilkan notifikasi jika tidak ada data yang ditemukan
    if (this.bookings.length === 0) {
      this.notification.info(
        'INFO',
        'Tidak ada pemesanan yang ditemukan untuk tanggal ini',
        { nzDuration: 5000 }
      );
    }
  }


}
