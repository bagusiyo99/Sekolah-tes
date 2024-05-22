import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss']
})
export class AdDetailComponent implements OnInit {

  adId = this.activatedroute.snapshot.params['adId'];
  avatarUrl: any;
  ad: any;
  isSubmitting: boolean = false; // Flag untuk melacak status permintaan
  validateForm: FormGroup;

  constructor(
    private clientService: ClientService,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    // Buat form dengan validasi kustom
    this.validateForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(1)]], // Jumlah pesanan minimal 1
    });

    this.getAdDetailsByAdId();
  }

  getAdDetailsByAdId() {
    this.clientService.getAdDetailsByAdId(this.adId).subscribe(res => {
      console.log(res);
      if (res && res.adDTO && res.adDTO.returnedImg !== "") {
        this.avatarUrl = 'data:image/jpeg;base64,' + res.adDTO.returnedImg;
        this.ad = res.adDTO;
      } else {
        console.error('ReturnedImg is empty or null:', res);
      }
    });
  }

  OrderProduct() {
    if (this.validateForm.invalid) {
      this.notification.error(
        'ERROR',
        'Mohon isi formulir dengan benar',
        { nzDuration: 5000 }
      );
      return;
    }

    const amount = this.validateForm.get(['amount']).value;

    const foodOrderDto = {
      amount,
      adId: this.adId,
      userId: UserStorageService.getUserId(),
    };

    // Set flag `isSubmitting` ke true untuk menandai permintaan sedang berlangsung
    this.isSubmitting = true;

    // Kirim DTO ke layanan pemesanan
    this.clientService.OrderProduct(foodOrderDto).subscribe(
      res => {
        // Setelah permintaan berhasil, set flag `isSubmitting` ke false
        this.isSubmitting = false;
        this.notification.success(
          'SUCCESS',
          'Pemesanan berhasil',
          { nzDuration: 5000 }
        );
        this.router.navigateByUrl('/client/bookings');
      },
      error => {
        // Jika terjadi kesalahan, set flag `isSubmitting` ke false
        this.isSubmitting = false;
        this.notification.error(
          'ERROR',
          error.error,
          { nzDuration: 5000 }
        );
      }
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

}
