import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent {
  //02.09

  adId:any = this.activatedroute.snapshot.params['id'];

config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
  };

  validateForm!:FormGroup;
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;
  existingImage:string | null = null;
  kindProductOptions= ['Pria', 'Wanita', 'Aksesoris']; // Inisialisasi jenis mobil

  imgChanged = false;

    
  constructor (
    private companyService: CompanyService,
     private fb :FormBuilder,
     private notification :NzNotificationService,
     private router: Router,
         private activatedroute:ActivatedRoute

     ){}


  ngOnInit() {
    this.validateForm = this.fb.group({
      nameProduct: [null, [Validators.required]],
     stock: [null, [Validators.required]],
     remainingStock: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      kindProduct: [null, [Validators.required]] // Tambahkan jenis mobil ke dalam formulir

    });
  this.getAdByid(); // Memanggil metode dengan menggunakan ()
      // Subscribe to changes in stock
    this.validateForm.get('stock')?.valueChanges.subscribe((newValue) => {
      // Set remainingStock equal to stock
      this.validateForm.get('remainingStock')?.setValue(newValue);
    });
  }

  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.existingImage = null;
    this.imgChanged = true;
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

updateAd() {
  const formData: FormData = new FormData();

  // Periksa apakah gambar telah diubah
  if (this.imgChanged && this.selectedFile) {
    formData.append('img', this.selectedFile);
  }

  // Tambahkan data lain ke formData
  formData.append('nameProduct', this.validateForm.get('nameProduct').value);
      formData.append('stock', this.validateForm.get('stock')?.value.toString());
  formData.append('description', this.validateForm.get('description').value);
  formData.append('price', this.validateForm.get('price').value);
      formData.append('kindProduct', this.validateForm.get('kindProduct')?.value); // tambahkan jenis mobil ke dalam formData
      formData.append('remainingStock', this.validateForm.get('remainingStock')?.value.toString());

  this.companyService.updateAd(this.adId, formData).subscribe(
    res => {
      this.notification.success(
        'SUCCESS',
        'Data berhasil diperbarui',
        { nzDuration: 5000 }
      );
      this.router.navigateByUrl('/company/postingan');
    },
    error => {
      this.notification.error(
        'ERROR',
        error.error,
        { nzDuration: 5000 }
      );
    }
  );
}


  
  
  getAdByid(){
    this.companyService.getAdById(this.adId).subscribe(res => {
      console.log(res);
      this.validateForm.patchValue(res);
      this.existingImage = 'data:image/jpeg;base64, ' + res.returnedImg;
    })
  }

}