package com.sekolah.controller;

import com.sekolah.dto.ContactDTO;
import com.sekolah.dto.ReservationDTO;
import com.sekolah.services.Blog.BlogService;
import com.sekolah.services.client.ClientService;
import com.sekolah.services.contact.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    // Injeksi dependensi layanan ClientService
    @Autowired
    private ClientService clientService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private ContactService contactService;


    // Mendapatkan semua iklan yang tersedia
    @GetMapping("/ads")
    public ResponseEntity<?> getAllAds() {
        // Mengambil semua iklan melalui ClientService
        return ResponseEntity.ok(clientService.getAllAds());
    }

    @GetMapping("/articles")
    public ResponseEntity<?> getAllArticles () {
        // Mengambil semua iklan melalui ClientService
        return ResponseEntity.ok(clientService.getAllArticles());
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeachers () {
        // Mengambil semua iklan melalui ClientService
        return ResponseEntity.ok(clientService.getAllTeachers());
    }

    // Mencari iklan berdasarkan nama layanan
    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchAdByService(@PathVariable String name) {
        // Mencari iklan menggunakan ClientService dan mengembalikan hasil pencarian
        return ResponseEntity.ok(clientService.searchAdByName(name));
    }

    // Membuat reservasi layanan
    @PostMapping("/book-service")
    public ResponseEntity<?> foodProduct(@RequestBody ReservationDTO reservationDTO) {
        // Melakukan reservasi layanan melalui ClientService
        boolean success = clientService.OrderProduct(reservationDTO);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Mendapatkan detail iklan berdasarkan ID iklan
    @GetMapping("/ad/{adId}")
    public ResponseEntity<?> getAdDetailsByAdId(@PathVariable Long adId) {
        // Mengambil detail iklan melalui ClientService
        return ResponseEntity.ok(clientService.getAdDetailsByAdId(adId));
    }

    // Mendapatkan semua reservasi pengguna berdasarkan ID pengguna
    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<?> getAllBookingsByUserId(@PathVariable Long userId) {
        // Mengambil semua reservasi pengguna melalui ClientService
        return ResponseEntity.ok(clientService.getAllBookingsByUserId(userId));

    }

    ///// awalan client

    @PostMapping("/contact/{userId}")
    public ResponseEntity<?> postContact(@PathVariable Long userId, @ModelAttribute ContactDTO contactDTO) throws IOException {
        boolean success = contactService.postContact(userId, contactDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the required Company role.");
        }
    }



    @GetMapping("/contact/{contactId}")
    public ResponseEntity<?> getContactById(@PathVariable Long contactId) {
        ContactDTO contactDTO = contactService.getContactById(contactId);
        if (contactDTO != null) {
            return ResponseEntity.ok(contactDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/booking/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        // Menghapus reservasi menggunakan CompanyService
        boolean success = clientService.deleteBooking(bookingId);
        // Jika berhasil, kembalikan status OK, jika tidak, kembalikan status NOT FOUND
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/searchC/{address}")
    public ResponseEntity<?> searchContactByService(@PathVariable String name) {
        // Mencari iklan menggunakan ClientService dan mengembalikan hasil pencarian
        return ResponseEntity.ok(contactService.searchContactByName(name));
    }
}
