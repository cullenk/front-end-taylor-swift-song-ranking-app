import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../../services/mail.service';
import { Meta, Title } from '@angular/platform-browser';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitStatus: SubmitStatus = 'idle';
  private readonly resetDelay = 5000; // 5 seconds

  constructor(
    private fb: FormBuilder, 
    private mailService: MailService,
    private meta: Meta,
    private title: Title
  ) {
    this.contactForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.updateMetaTags();
  }

  /**
   * Creates and initializes the contact form with validation
   */
  private createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  /**
   * Updates SEO meta tags for the contact page
   */
  private updateMetaTags(): void {
    const pageTitle = 'Contact - Swiftie Ranking Hub';
    const description = 'Get in touch with the Swiftie Ranking Hub team. We\'d love to hear your feedback, questions, or suggestions!';
    const imageUrl = 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp';
    const pageUrl = 'https://swiftierankinghub.com/user/contact';

    // Set page title
    this.title.setTitle(pageTitle);
    
    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: description });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.contactForm.valid && this.submitStatus !== 'sending') {
      this.submitStatus = 'sending';
      
      const formData = this.contactForm.value;
      
      this.mailService.sendContactFormEmail(formData).subscribe({
        next: (response) => {
          console.log('Contact form sent successfully', response);
          this.handleSubmissionSuccess();
        },
        error: (error) => {
          console.error('Error sending contact form', error);
          this.handleSubmissionError();
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  /**
   * Handles successful form submission
   */
  private handleSubmissionSuccess(): void {
    this.submitStatus = 'success';
    this.contactForm.reset();
    
    // Reset status after delay
    setTimeout(() => {
      if (this.submitStatus === 'success') {
        this.submitStatus = 'idle';
      }
    }, this.resetDelay);
  }

  /**
   * Handles form submission error
   */
  private handleSubmissionError(): void {
    this.submitStatus = 'error';
    
    // Reset status after delay
    setTimeout(() => {
      if (this.submitStatus === 'error') {
        this.submitStatus = 'idle';
      }
    }, this.resetDelay);
  }

  /**
   * Marks all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Gets error message for a specific form field
   */
  getFieldError(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'Name is required';
        if (errors['minlength']) return 'Name must be at least 2 characters';
        if (errors['maxlength']) return 'Name cannot exceed 50 characters';
        break;
        
      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email']) return 'Please enter a valid email address';
        if (errors['maxlength']) return 'Email cannot exceed 100 characters';
        break;
        
      case 'message':
        if (errors['required']) return 'Message is required';
        if (errors['minlength']) return 'Message must be at least 10 characters';
        if (errors['maxlength']) return 'Message cannot exceed 1000 characters';
        break;
    }

    return '';
  }

  /**
   * Checks if a specific field has an error and should show error styling
   */
  hasFieldError(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.errors && control.touched);
  }

  /**
   * Gets the current character count for the message field
   */
  getMessageCharCount(): number {
    const messageControl = this.contactForm.get('message');
    return messageControl?.value?.length || 0;
  }

  /**
   * Clears any status messages
   */
  clearStatus(): void {
    if (this.submitStatus === 'success' || this.submitStatus === 'error') {
      this.submitStatus = 'idle';
    }
  }
}