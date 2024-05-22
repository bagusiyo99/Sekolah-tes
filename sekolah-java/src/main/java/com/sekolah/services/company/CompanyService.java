package com.sekolah.services.company;

import com.sekolah.dto.AdDTO;
import com.sekolah.dto.ContactDTO;
import com.sekolah.dto.ReservationDTO;

import java.io.IOException;
import java.util.List;

public interface CompanyService {
    boolean postAd (Long userId, AdDTO adDTO) throws IOException;

    List<AdDTO> getAllAds(Long userid);

    AdDTO getAdById(Long adId);

     boolean updateAd(Long adId, AdDTO adDTO) throws IOException;

    boolean deleteAd(Long adId);

    List<ReservationDTO> getAllAdBookings(Long companyId);
    List<ContactDTO> getAllContact();

    List<AdDTO> searchAdByName (String name);

    boolean deleteBooking(Long bookingId);


    List<ReservationDTO> getAllAdBookingsGroupedByUser(Long companyId);
}