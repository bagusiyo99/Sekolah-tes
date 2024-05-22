import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-postingan',
  templateUrl: './postingan.component.html',
  styleUrls: ['./postingan.component.scss']
})
export class PostinganComponent implements OnInit {

  ads: any[] = [];
  pagedAds: any[] = [];
  currentAdsPage: number = 1;
  adsPerPage: number = 6;
  totalAds: number = 0;
  totalAdsPages: number = 0;
  validateForm!: FormGroup;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      service: [null, Validators.required],
      kindProduct: ['all', Validators.required]
    });
    this.getAllAds();
  }

  getAllAds() {
    const kindProduct = this.validateForm.get('kindProduct')?.value;

    this.clientService.getAllAds().subscribe(
      (res) => {
        if (kindProduct === 'all') {
          this.ads = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
          this.ads = res.filter(ad => ad.kindProduct === kindProduct);
          if (this.ads.length === 0) {
            this.notification.warning(
              'Peringatan',
              `Tidak ada iklan yang ditemukan untuk kategori ${kindProduct}`,
              { nzDuration: 5000 }
            );
          }
        }

        this.totalAds = this.ads.length;
        this.totalAdsPages = Math.ceil(this.totalAds / this.adsPerPage);
        this.updatePagedAds();
      },
      (error) => {
        console.error('Gagal memuat iklan:', error);
      }
    );
  }

  updateImg(img: any) {
    return 'data:image/jpeg;base64,' + img;
  }



  searchAdByName() {
    const searchTerm = this.validateForm.get('service')?.value;

    if (!searchTerm) {
      this.getAllAds();
      return;
    }

    this.clientService.searchAdByName(searchTerm).subscribe(
      res => {
        this.ads = res;

        if (!this.ads || this.ads.length === 0) {
          this.notification.warning(
            'Peringatan',
            'Tidak ada data yang ditemukan untuk pencarian Anda',
            { nzDuration: 5000 }
          );
        }

        this.updatePagedAds();
      },
      error => {
        console.error('Gagal mencari iklan:', error);
        this.notification.error(
          'ERROR',
          'Gagal mencari data',
          { nzDuration: 5000 }
        );
      }
    );
  }

  goToAdsPage(page: number) {
    this.currentAdsPage = page;
    this.updatePagedAds();
  }

  updatePagedAds() {
    const start = (this.currentAdsPage - 1) * this.adsPerPage;
    const end = start + this.adsPerPage;
    this.pagedAds = this.ads.slice(start, end);
  }

  limitDescription(description: string, limit: number): string {
    if (description.length > limit) {
      return description.substring(0, limit) + '...';
    } else {
      return description;
    }
  }


 

}
