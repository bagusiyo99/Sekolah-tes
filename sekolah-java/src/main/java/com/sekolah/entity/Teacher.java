package com.sekolah.entity;

import com.sekolah.dto.ArticleDTO;
import com.sekolah.dto.TeacherDto;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
@Entity
@Table(name = "teachers")
@Data

public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(length = 1000) // Mengatur panjang maksimum kolom menjadi 1000 karakter
    private String description;

    // Gambar iklan sebagai array byte (LOB - Large Object)
    @Lob
    @Column(columnDefinition = "longblob")
    private byte[] img;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;


    private Date createdAt;



    public TeacherDto getTeacherDto() {
        TeacherDto teacherDTO = new TeacherDto();
        teacherDTO.setId(id);
        teacherDTO.setTitle(title);
        teacherDTO.setDescription(description);
        teacherDTO.setCreatedAt(createdAt);
        teacherDTO.setReturnedImg(img);
        teacherDTO.setCompanyName(user.getName()); // Tambahkan nama perusahaan ke DTO

        // Mengembalikan objek
        return teacherDTO;
    }
}
