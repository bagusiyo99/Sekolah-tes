package com.sekolah.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ReservationDTO {
    private Long id;                          // ID reservasi


    private String nameProduct;               // Nama layanan yang dipesan


    private Long userId;                      // ID pengguna yang melakukan reservasi

    private String userName;                  // Nama pengguna yang melakukan reservasi

    private Long companyId;                   // ID perusahaan yang menyediakan layanan

    private Long adId;                        // ID iklan terkait layanan yang dipesan



    private Double amount;




    private List<ReservationDTO> reservations; // Properti untuk menyimpan daftar reservasi
    private Date createdAt;

}
