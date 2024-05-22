package com.sekolah.services.company;

import com.sekolah.dto.AdDTO;
import com.sekolah.dto.ContactDTO;
import com.sekolah.dto.ReservationDTO;
import com.sekolah.entity.*;
import com.sekolah.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompanyServicempl implements CompanyService {

    // Dependency injection untuk UserRepository
    @Autowired
    private UserRepository userRepository;

    // Dependency injection untuk AdRepository
    @Autowired
    private AdRepository adRepository;

    // Dependency injection untuk ReservationRepository
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ContactRepository contactRepository;



    // Metode untuk memposting iklan baru
    public boolean postAd(Long userId, AdDTO adDTO) throws IOException {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            Ad ad = new Ad();
            ad.setNameProduct(adDTO.getNameProduct());
            ad.setKindProduct(adDTO.getKindProduct());
            ad.setDescription(adDTO.getDescription());
            ad.setImg(adDTO.getImg().getBytes());
            ad.setStock(adDTO.getStock());
            ad.setRemainingStock(adDTO.getRemainingStock());
            ad.setCreatedAt(new Date());

            ad.setUser(optionalUser.get());
            adRepository.save(ad);
            return true;
        }
        return false;
    }



    // Metode untuk mencari iklan berdasarkan nama
    public List<AdDTO> searchAdByName(String name) {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO berdasarkan nama yang diberikan
        return adRepository.findAllByNameProductContaining(name).stream().map(Ad::getAdDto).collect(Collectors.toList());
    }


    // Metode untuk mendapatkan semua iklan berdasarkan ID pengguna (perusahaan)
    public List<AdDTO> getAllAds(Long userId) {
        return adRepository.findAllByUserId(userId).stream().map(Ad::getAdDto).collect(Collectors.toList());
    }

    // Metode untuk mendapatkan iklan berdasarkan ID iklan
    public AdDTO getAdById(Long adId) {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            return optionalAd.get().getAdDto();
        }
        return null;
    }

    // Metode untuk memperbarui iklan berdasarkan ID iklan
    public boolean updateAd(Long adId, AdDTO adDTO) throws IOException {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            Ad ad = optionalAd.get();
            ad.setNameProduct(adDTO.getNameProduct());
            ad.setKindProduct(adDTO.getKindProduct());
            ad.setDescription(adDTO.getDescription());
            ad.setStock(adDTO.getStock());
            ad.setRemainingStock(adDTO.getRemainingStock());
            ad.setCreatedAt(new Date());
            // Mengatur gambar jika ada
            if (adDTO.getImg() != null) {
                ad.setImg(adDTO.getImg().getBytes());
            }
            adRepository.save(ad);
            return true;
        }
        return false;
    }

    // Metode untuk menghapus iklan berdasarkan ID iklan
    public boolean deleteAd(Long adId) {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            adRepository.delete(optionalAd.get());
            return true;
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

    public List<ReservationDTO> getAllAdBookings(Long companyId) {
        return reservationRepository.findAllByCompanyId(companyId)
                .stream().map(Reservation::getReservationDTO).collect(Collectors.toList());
    }

    public List<ReservationDTO> getAllAdBookingsGroupedByUser(Long companyId) {
        // Mengambil semua reservasi berdasarkan ID perusahaan dari database
        List<Reservation> reservations = reservationRepository.findAllByCompanyId(companyId);

        // Mengelompokkan reservasi berdasarkan pengguna (client) yang melakukan pemesanan
        Map<User, List<ReservationDTO>> groupedByUser = reservations.stream()
                .collect(Collectors.groupingBy(Reservation::getUser,
                        Collectors.mapping(Reservation::getReservationDTO, Collectors.toList())));

        // Membuat daftar ReservationDTO untuk menyimpan hasil akhir
        List<ReservationDTO> bookingDTOs = new ArrayList<>();

        // Iterasi melalui setiap kelompok pengguna dan mengumpulkan informasi yang relevan
        groupedByUser.forEach((user, userReservations) -> {
            // Membuat ReservationDTO baru untuk setiap pengguna
            ReservationDTO bookingDTO = new ReservationDTO();
            bookingDTO.setUserId(user.getId()); // Set ID pengguna
            bookingDTO.setUserName(user.getName()); // Set nama pengguna

            // Mengumpulkan informasi dari setiap reservasi untuk pengguna ini
            List<String> nameProducts = new ArrayList<>();
            List<Double> amounts = new ArrayList<>();

            for (ReservationDTO reservation : userReservations) {
                // Hanya memproses reservasi yang disetujui
                nameProducts.add(reservation.getNameProduct());
                amounts.add(reservation.getAmount());

            }



            // Set nilai-nilai yang dihitung ke dalam ReservationDTO
            bookingDTO.setNameProduct(String.join(", ", nameProducts));
            bookingDTO.setAmount(amounts.stream().reduce(0.0, Double::sum));


            bookingDTO.setReservations(userReservations); // Set daftar reservasi untuk pengguna ini

            bookingDTOs.add(bookingDTO); // Menambahkan ReservationDTO ke dalam daftar hasil
        });

        return bookingDTOs; // Mengembalikan daftar hasil
    }






    public List<ContactDTO> getAllContact () {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO
        return contactRepository.findAll().stream().map(Contact::getContactDto).collect(Collectors.toList());
    }


}
