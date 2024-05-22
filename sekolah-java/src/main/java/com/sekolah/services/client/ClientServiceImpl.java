// Paket dan impor
package com.sekolah.services.client;

import com.sekolah.dto.*;
import com.sekolah.entity.*;
import com.sekolah.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements ClientService {
    // Dependency injection untuk AdRepository
    @Autowired
    private AdRepository adRepository;

    // Dependency injection untuk UserRepository
    @Autowired
    private UserRepository userRepository;

    // Dependency injection untuk ReservationRepository
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // Metode untuk mendapatkan semua iklan
    public List<AdDTO> getAllAds() {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO
        return adRepository.findAll().stream().map(Ad::getAdDto).collect(Collectors.toList());
    }

    public List<ArticleDTO> getAllArticles () {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO
        return articleRepository.findAll().stream().map(Article::getArticleDto).collect(Collectors.toList());
    }

    public List<TeacherDto> getAllTeachers () {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO
        return teacherRepository.findAll().stream().map(Teacher::getTeacherDto).collect(Collectors.toList());
    }


    // Metode untuk mencari iklan berdasarkan nama
    public List<AdDTO> searchAdByName(String name) {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO berdasarkan nama yang diberikan
        return adRepository.findAllByNameProductContaining(name).stream().map(Ad::getAdDto).collect(Collectors.toList());
    }


    // Metode untuk memesan layanan
    public boolean OrderProduct (ReservationDTO reservationDTO) {
        Optional<Ad> optionalAd = adRepository.findById(reservationDTO.getAdId());
        Optional<User> optionalUser = userRepository.findById(reservationDTO.getUserId());

        if (optionalAd.isPresent() && optionalUser.isPresent()) {
            Ad ad = optionalAd.get();
            if (ad.getRemainingStock() >= reservationDTO.getAmount()) { // Pastikan stok cukup
                double orderedAmount = reservationDTO.getAmount();

                // Kurangi remainingStock
                ad.setRemainingStock((int) (ad.getRemainingStock() - orderedAmount));

                Reservation reservation = new Reservation();
                reservation.setAmount(orderedAmount); // Set jumlah pesanan



                reservation.setUser(optionalUser.get());
                reservation.setAd(ad);
                reservation.setCompany(ad.getUser());
                reservation.setCreatedAt(new Date()); // Set tanggal pembuatan

                reservationRepository.save(reservation);
                adRepository.save(ad); // Simpan perubahan remainingStock
                return true;
            }
        }
        return false;
    }


    public boolean deleteBooking(Long bookingId) {
        Optional<Reservation> optionalReservation = reservationRepository.findById(bookingId);
        if (optionalReservation.isPresent()) {
            Reservation reservation = optionalReservation.get();
            Ad ad = reservation.getAd();

            // Mengembalikan stok barang
            int returnedAmount = reservation.getAmount().intValue(); // Convert Double to int
            ad.setRemainingStock(ad.getRemainingStock() + returnedAmount);

            // Menyimpan perubahan pada Ad
            adRepository.save(ad);

            // Menghapus pemesanan
            reservationRepository.delete(reservation);
            return true;
        }
        return false;
    }




    // Metode untuk mendapatkan detail iklan berdasarkan ID iklan
    public AdDetailsForClientDto getAdDetailsByAdId(Long adId) {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        AdDetailsForClientDto adDetailsForClientDto = new AdDetailsForClientDto();

        // Memeriksa apakah iklan ada
        if (optionalAd.isPresent()) {
            // Menetapkan detail AdDTO ke objek AdDetailsForClientDto
            adDetailsForClientDto.setAdDTO(optionalAd.get().getAdDto());
        }
        return adDetailsForClientDto;
    }

    // Metode untuk mendapatkan semua pemesanan berdasarkan ID pengguna
    public List<ReservationDTO> getAllBookingsByUserId(Long userId) {
        // Menggunakan stream untuk memetakan setiap Reservation menjadi ReservationDTO
        return reservationRepository.findAllByUserId(userId)
                .stream().map(Reservation::getReservationDTO).collect(Collectors.toList());
    }
}
