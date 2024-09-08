import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoginMode = true;
  isForgotPasswordMode = false;
  albumCovers: string[] = [
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/1989.jpeg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/evermore.jpeg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/fearless_taylors_version_album.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/folklore.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/lover.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/midnights.jpeg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd1.png',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/red-tv.jpeg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/reputation.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/speak-now-tv.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/Taylor+Swift.jpg',
    'https://all-taylor-swift-album-covers.s3.us-east-2.amazonaws.com/ttpd.jpg'
  ];
  
  shuffledColumns: string[][] = [];

  @ViewChild('albumColumns') albumColumnsElement!: ElementRef;
  @ViewChild('randomSquares') randomSquaresElement!: ElementRef;

  constructor(
    private AuthService: AuthService,
    private MailService: MailService,
    private renderer: Renderer2,
    private toastr: ToastrService
  ) {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });

    this.signupForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });

    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
    this.shuffleAlbumCovers();
  }

  ngAfterViewInit() {
    this.generateRandomSquares();
  }

  shuffleAlbumCovers() {
    const shuffled = [...this.albumCovers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Create three shuffled columns
    this.shuffledColumns = [
      shuffled.slice(0, 4),
      shuffled.slice(4, 8),
      shuffled.slice(8, 12)
    ];
  }

  generateRandomSquares() {
    if (!this.randomSquaresElement) return;

    const container = this.randomSquaresElement.nativeElement;
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'];
    const numSquares = 15;

    for (let i = 0; i < numSquares; i++) {
      const square = this.renderer.createElement('div');
      this.renderer.addClass(square, 'random-square');
      
      const size = Math.floor(Math.random() * 50) + 20;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      this.renderer.setStyle(square, 'width', `${size}px`);
      this.renderer.setStyle(square, 'height', `${size}px`);
      this.renderer.setStyle(square, 'top', `${top}%`);
      this.renderer.setStyle(square, 'left', `${left}%`);
      this.renderer.setStyle(square, 'background-color', color);
      this.renderer.setStyle(square, 'opacity', '0.5');
      
      this.renderer.appendChild(container, square);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.albumColumnsElement) return;

    const columns = this.albumColumnsElement.nativeElement.querySelectorAll('.column');
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;

    columns.forEach((column: HTMLElement, index: number) => {
      const movement = (index % 2 === 0 ? 1 : -1) * 50 * (mouseY - 0.5);
      this.renderer.setStyle(column, 'transform', `translateY(${movement}px)`);
    });
  }

  //On create account submit from frontend
  onSubmit() {
    if (this.isLoginMode) {
      this.AuthService.loginUser(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
          (response) => {
            this.toastr.success('Login successful!', 'Success');
            // Handle successful login (e.g., navigate to dashboard)
          },
          (error) => {
            this.toastr.error('Login failed. Please check your credentials.', 'Error');
          }
        );
    } else {
      this.AuthService.createNewUser(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe(
          (response) => {
            this.toastr.success('Account created successfully! Check your email for a welcome message.', 'Success');
            this.isLoginMode = true; // Switch back to login mode
          },
          (error) => {
            this.toastr.error('Account creation failed. Please try again.', 'Error');
          }
        );
    }
  }
  
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Reset forms when toggling
    if (this.isLoginMode) {
      this.loginForm.reset();
    } else {
      this.signupForm.reset();
    }
  }

  onForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.AuthService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        () => {
          this.toastr.success('Password reset email sent. Please check your inbox.', 'Success');
          this.isForgotPasswordMode = false;
        },
        (error) => {
          this.toastr.error('Failed to send password reset email. Please try again.', 'Error');
        }
      );
    }
  }

  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.forgotPasswordForm.reset();
  }
}

