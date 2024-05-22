// com.hotel.services.client.ClientService

package com.sekolah.services.client;

import com.sekolah.dto.*;

import java.util.List;

public interface ClientService {
    List<AdDTO> getAllAds();
    List<AdDTO> searchAdByName (String name);

    List<ArticleDTO> getAllArticles ();
    List<TeacherDto> getAllTeachers ();
    boolean OrderProduct (ReservationDTO reservationDTO);
    AdDetailsForClientDto getAdDetailsByAdId (Long adId);
    public boolean deleteBooking(Long bookingId);
    List<ReservationDTO> getAllBookingsByUserId (Long userId);
}
