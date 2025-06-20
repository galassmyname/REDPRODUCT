import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  expandedHotelId: string | null = null;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.hotelService.getHotels().subscribe({
      next: (data: any) => {
        this.hotels = Array.isArray(data) ? data : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.errorMessage = 'Erreur lors du chargement des hôtels';
        this.isLoading = false;
      }
    });
  }

  toggleHotelDetails(hotelId: string): void {
    this.expandedHotelId = this.expandedHotelId === hotelId ? null : hotelId;
  }

  deleteHotel(id: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      this.hotelService.deleteHotel(id).subscribe({
        next: () => {
          this.loadHotels();
          this.expandedHotelId = null;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = 'Erreur lors de la suppression de l\'hôtel';
        }
      });
    }
  }

  getHotelImage(hotel: any): string {
    if (!hotel.photos || hotel.photos.length === 0) {
      return 'assets/default-hotel.jpg';
    }
    
    if (hotel.photos[0].startsWith('http')) {
      return hotel.photos[0];
    }
    
    if (hotel.photos[0].startsWith('/uploads/')) {
      return `https://redproduct.onrender.com${hotel.photos[0]}`;
    }
    
    return `https://redproduct.onrender.com/uploads/${hotel.photos[0]}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-hotel.jpg';
  }
}