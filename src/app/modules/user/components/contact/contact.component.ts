// contact.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../../services/mail.service';

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

  constructor(private fb: FormBuilder, private mailService: MailService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
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