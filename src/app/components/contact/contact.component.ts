import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private title: Title
  ) {
    this.updateMetaTags();
    this.contactForm = this.createContactForm();
  }

  private updateMetaTags(): void {
    this.title.setTitle('Contact Us - Swiftie Ranking Hub');
    
    const description = 'Get in touch with Swiftie Ranking Hub. Contact us for support, feedback, or questions about our Taylor Swift song ranking platform.';
    
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'contact, support, swiftie ranking hub, taylor swift, feedback' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: 'Contact Us - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/contact' });
  }

  private createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = false;
      this.submitSuccess = false;

      // Simulate form submission
      setTimeout(() => {
        // In a real application, you would send this to your backend
        console.log('Contact form submitted:', this.contactForm.value);
        
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }, 1500);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
      if (field.errors['maxlength']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too long`;
    }
    return '';
  }
}
