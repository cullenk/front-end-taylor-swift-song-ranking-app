// contact.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../../services/mail.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  submitStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  constructor(
    private fb: FormBuilder, 
    private mailService: MailService,
    private meta: Meta,
    private title: Title) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  updateMetaTags() {
    this.title.setTitle('Contact - Swiftie Ranking Hub');
    
    this.meta.updateTag({ name: 'description', content: 'Contact form for any questions about the Swiftie Ranking Hub.' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Contact - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: 'Contact form for any questions about the Swiftie Ranking Hub.'});
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/user/contact' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Contact - Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Contact form for any questions about the Swiftie Ranking Hub.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitStatus = 'sending';
      this.mailService.sendContactFormEmail(this.contactForm.value).subscribe(
        response => {
          console.log('Contact form sent successfully', response);
          this.submitStatus = 'success';
          this.contactForm.reset();
        },
        error => {
          console.error('Error sending contact form', error);
          this.submitStatus = 'error';
        }
      );
    }
  }
}