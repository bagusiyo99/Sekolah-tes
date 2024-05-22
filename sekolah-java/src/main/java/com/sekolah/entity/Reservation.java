// Paket dan impor
package com.sekolah.entity;

import com.sekolah.dto.ReservationDTO;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
public class Reservation {

    // ID unik untuk setiap entitas reservasi; ini adalah kunci utama
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Double amount;




    private Date createdAt;

    // Hubungan dengan entitas User untuk pengguna yang membuat reservasi
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    // Hubungan dengan entitas User untuk perusahaan yang menerima reservasi
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User company;

    // Hubungan dengan entitas Ad untuk iklan yang dipesan
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ad_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ad ad;

    // Metode untuk mengonversi entitas Reservation menjadi objek ReservationDTO
    public ReservationDTO getReservationDTO() {
        // Membuat instance ReservationDTO
        ReservationDTO dto = new ReservationDTO();
        // Menetapkan nilai-nilai entitas Reservation ke objek ReservationDTO
        dto.setId(id);
        dto.setNameProduct(ad.getNameProduct());

        dto.setAmount(amount);

        dto.setCreatedAt(createdAt);


        // Menetapkan ID Ad, ID perusahaan, dan nama pengguna ke objek DTO
        dto.setAdId(ad.getId());
        dto.setCompanyId(company.getId());
        dto.setUserName(user.getName());





        // Mengembalikan objek ReservationDTO
        return dto;
    }
}
