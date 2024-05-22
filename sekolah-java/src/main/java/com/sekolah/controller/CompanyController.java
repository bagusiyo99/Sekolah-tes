package com.sekolah.controller;

import com.sekolah.dto.AdDTO;
import com.sekolah.dto.ArticleDTO;
import com.sekolah.dto.ReservationDTO;
import com.sekolah.dto.TeacherDto;
import com.sekolah.services.Blog.BlogService;
import com.sekolah.services.company.CompanyService;
import com.sekolah.services.contact.ContactService;
import com.sekolah.services.teacher.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private TeacherService teacherService;

    // Metode untuk memposting iklan
    @PostMapping("/ad/{userId}")
    public ResponseEntity<?> postAd(@PathVariable Long userId, @ModelAttribute AdDTO adDTO) throws IOException {
        // Memposting iklan menggunakan CompanyService
        boolean success = companyService.postAd(userId, adDTO);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Metode untuk mendapatkan semua iklan berdasarkan ID pengguna untuk detail
    @GetMapping("/ads/{userId}")
    public ResponseEntity<?> getAllAdsByUserId(@PathVariable Long userId) {
        // Mengambil semua iklan menggunakan CompanyService
        return ResponseEntity.ok(companyService.getAllAds(userId));
    }

    // Metode untuk mendapatkan iklan berdasarkan ID iklan untuk detail
    @GetMapping("/ad/{adId}")
    public ResponseEntity<?> getAdById(@PathVariable Long adId) {
        // Mengambil iklan menggunakan CompanyService
        AdDTO adDTO = companyService.getAdById(adId);
        // Jika iklan ditemukan, kembalikan data iklan, jika tidak, kembalikan status NOT FOUND
        if (adDTO != null) {
            return ResponseEntity.ok(adDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Metode untuk memperbarui iklan berdasarkan ID iklan
    @PutMapping("/ad/{adId}")
    public ResponseEntity<?> updateAd(@PathVariable Long adId, @ModelAttribute AdDTO adDTO) throws IOException {
        // Memperbarui iklan menggunakan CompanyService
        boolean success = companyService.updateAd(adId, adDTO);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Metode untuk menghapus iklan berdasarkan ID iklan
    @DeleteMapping("/ad/{adId}")
    public ResponseEntity<?> deleteAd(@PathVariable Long adId) {
        // Menghapus iklan menggunakan CompanyService
        boolean success = companyService.deleteAd(adId);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Metode untuk mendapatkan semua reservasi berdasarkan ID perusahaan untuk detail
    @GetMapping("/bookings/{companyId}")
    public ResponseEntity<List<ReservationDTO>> getAllAdBookings(@PathVariable Long companyId) {
        // Mengambil semua reservasi menggunakan CompanyService
        return ResponseEntity.ok(companyService.getAllAdBookings(companyId));
    }

    @GetMapping("/bookings/grouped/{companyId}")
    public ResponseEntity<List<ReservationDTO>> getAllAdBookingsGroupedByUser(@PathVariable Long companyId) {
        List<ReservationDTO> bookings = companyService.getAllAdBookingsGroupedByUser(companyId);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/booking/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        // Menghapus reservasi menggunakan CompanyService
        boolean success = companyService.deleteBooking(bookingId);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchAdByService(@PathVariable String name) {
        // Mencari iklan menggunakan ClientService dan mengembalikan hasil pencarian
        return ResponseEntity.ok(companyService.searchAdByName(name));
    }



    /// contact
    @GetMapping("/contacts")
    public ResponseEntity<?> getAllContact() {
        return ResponseEntity.ok(companyService.getAllContact());
    }


    /// article
    @PostMapping("/article/{userId}")
    public ResponseEntity<?> postArticle(@PathVariable Long userId, @ModelAttribute ArticleDTO articleDTO) throws IOException {
        boolean success = blogService.postArticle(userId, articleDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the required Company role.");
        }
    }

    //// awalan artikel
    @GetMapping("/articles/{userId}")
    public ResponseEntity<?> getAllArticlesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(blogService.getAllArticles(userId));
    }

    @GetMapping("/article/{articleId}")
    public ResponseEntity<?> getArticleById(@PathVariable Long articleId) {
        ArticleDTO articleDTO = blogService.getArticleById(articleId);
        if (articleDTO != null) {
            return ResponseEntity.ok(articleDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/article/{articleId}")
    public ResponseEntity<?> updateArticle(@PathVariable Long articleId, @ModelAttribute ArticleDTO articleDTO) throws IOException {
        boolean success = blogService.updateArticle(articleId, articleDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the required Company role.");
        }
    }

    @DeleteMapping("/article/{articleId}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long articleId) {
        boolean success = blogService.deleteArticle(articleId);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found or user does not have the required Company role.");
        }
    }

    @GetMapping("/cari/{title}")
    public ResponseEntity<?> searchArticleByService(@PathVariable String title) {
        // Mencari iklan menggunakan ClientService dan mengembalikan hasil pencarian
        return ResponseEntity.ok(blogService.searchArticleByTitle(title));
    }


    @PostMapping("/teacher/{userId}")
    public ResponseEntity<?> postTeacher(@PathVariable Long userId, @ModelAttribute TeacherDto teacherDto) throws IOException {
        boolean success = teacherService.postTeacher(userId, teacherDto);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the required Company role.");
        }
    }

    @GetMapping("/teachers/{userId}")
    public ResponseEntity<?> getAllTeachersByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(teacherService.getAllTeachers(userId));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable Long teacherId) {
        TeacherDto teacherDto = teacherService.getTeacherById(teacherId);
        if (teacherDto != null) {
            return ResponseEntity.ok(teacherDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/teacher/{teacherId}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long teacherId, @ModelAttribute TeacherDto teacherDto) throws IOException {
        boolean success = teacherService.updateTeacher(teacherId, teacherDto);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the required Company role.");
        }
    }

    @DeleteMapping("/teacher/{teacherId}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long teacherId) {
        boolean success = teacherService.deleteTeacher(teacherId);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found or user does not have the required Company role.");
        }
    }

    @GetMapping("/pencarian/{title}")
    public ResponseEntity<?> searchTeacherByService(@PathVariable String title) {
        // Mencari iklan menggunakan ClientService dan mengembalikan hasil pencarian
        return ResponseEntity.ok(teacherService.searchTeacherByTitle(title));
    }


}
