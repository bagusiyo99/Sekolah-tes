// Paket dan impor
package com.sekolah.entity;

import com.sekolah.dto.AdDTO;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Table(name = "ads")
@Data
public class Ad {

    // ID unik untuk setiap entitas iklan; ini adalah kunci utama
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nama layanan atau produk yang diiklankan
    private String nameProduct;


    private String kindProduct;

    private int stock;
    private int remainingStock;

    @Lob
    @Column(length = 1000) // Mengatur panjang maksimum kolom menjadi 1000 karakter
    private String description;


    private Date createdAt;

    // Gambar iklan sebagai array byte (LOB - Large Object)
    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;

    // Hubungan dengan entitas User
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    // Metode untuk mengonversi entitas Ad menjadi objek AdDTO
    public AdDTO getAdDto() {
        // Membuat instance AdDTO
        AdDTO adDTO = new AdDTO();
        // Menetapkan nilai-nilai entitas Ad ke objek AdDTO
        adDTO.setId(id);
        adDTO.setNameProduct(nameProduct);
        adDTO.setDescription(description);

      adDTO.setStock(stock);
       adDTO.setRemainingStock(remainingStock);
        adDTO.setCreatedAt(createdAt);
        // Mengambil nama pengguna dari entitas User yang terkait
        adDTO.setCompanyName(user.getName());
        // Mengambil gambar iklan
        adDTO.setReturnedImg(img);
        adDTO.setKindProduct(kindProduct);

        // Mengembalikan objek AdDTO
        return adDTO;
    }
}
