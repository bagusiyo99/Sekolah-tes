package com.sekolah.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data

public class TeacherDto {
    private Long id;
    private String title;
    private String description;
    private MultipartFile img;   // File gambar iklan

    private byte[] returnedImg;  // Array byte untuk menyimpan gambar yang telah diambil kembali
    private Date createdAt;
    private Long userId;
    private String Email;

    // Properti untuk relasi ke Company
    private Long companyId;  // ID perusahaan yang terkait
    private String companyName;  // Nama perusahaan yang terkait
}
