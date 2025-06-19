import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HotelService } from '../../../services/hotel.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent {
  hotelForm: FormGroup;
  currencies = ['XOF', 'EUR', 'USD'];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    public router: Router
  ) {
    this.hotelForm = this.fb.group({
      nom_de_l_hotel: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero_de_telephone: ['', Validators.required],
      prix_par_nuit: ['', [Validators.required, Validators.min(0)]],
      devise: ['XOF']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    if (this.hotelForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('nom_de_l_hotel', this.hotelForm.value.nom_de_l_hotel);
    formData.append('adresse', this.hotelForm.value.adresse);
    formData.append('email', this.hotelForm.value.email);
    formData.append('numero_de_telephone', this.hotelForm.value.numero_de_telephone);
    formData.append('prix_par_nuit', this.hotelForm.value.prix_par_nuit.toString());
    formData.append('devise', this.hotelForm.value.devise || 'XOF');

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    try {
      const response = await this.hotelService.createHotel(formData).toPromise();
      alert('Hôtel créé avec succès!');
      this.router.navigate(['/hotels']);
    } catch (error: any) {
      console.error('Erreur complète:', error);
      if (error.error) {
        this.errorMessage = error.error.error || 'Erreur lors de la création';
      } else {
        this.errorMessage = 'Erreur de connexion au serveur';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.hotelForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
