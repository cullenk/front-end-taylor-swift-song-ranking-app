import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoginMode = true;
  isForgotPasswordMode = false;
  showPassword: boolean = false;

  // New password strength properties
  passwordStrength = 0;
  passwordLength = false;
  hasUpperCase = false;
  hasNumber = false;

  albumCovers: string[] = [
    'https://d3e29z0m37b0un.cloudfront.net/1989.jpeg',
    'https://d3e29z0m37b0un.cloudfront.net/evermore.jpeg',
    'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/folklore.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/lover.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/midnights.jpeg',
    'https://d3e29z0m37b0un.cloudfront.net/ttpd1.png',
    'https://d3e29z0m37b0un.cloudfront.net/red-tv.jpeg',
    'https://d3e29z0m37b0un.cloudfront.net/reputation.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.jpg',
    'https://d3e29z0m37b0un.cloudfront.net/ttpd.jpg',
  ];

  shuffledColumns: string[][] = [];

  @ViewChild('albumColumns') albumColumnsElement!: ElementRef;
  @ViewChild('randomSquares') randomSquaresElement!: ElementRef;

  constructor(
    private AuthService: AuthService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)/),
      ]),
    });

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    this.shuffleAlbumCovers();
    this.updateMetaTags();
  }

  ngAfterViewInit() {
    this.generateRandomSquares();
  }

  updateMetaTags() {
    this.title.setTitle('Swiftie Ranking Hub');

    this.meta.updateTag({
      name: 'description',
      content:
        'Sign in or create an account to join Swiftie Ranking Hub. Rank your favorite Taylor Swift songs and share your profile with other fans!',
    });

    // Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: 'Swiftie Ranking Hub',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Join Swiftie Ranking Hub to rank your favorite Taylor Swift songs and share your profile with other fans!',
    });
    this.meta.updateTag({
      property: 'og:image',
      content:
        'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://swiftierankinghub.com/login',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'Swiftie Ranking Hub',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        'Join Swiftie Ranking Hub to rank your favorite Taylor Swift songs and share your profile with other fans!',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content:
        'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.png',
    });
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
      shuffled.slice(8, 12),
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

    const columns =
      this.albumColumnsElement.nativeElement.querySelectorAll('.column');
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;

    columns.forEach((column: HTMLElement, index: number) => {
      const movement = (index % 2 === 0 ? 1 : -1) * 50 * (mouseY - 0.5);
      this.renderer.setStyle(column, 'transform', `translateY(${movement}px)`);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordInput() {
    const password = this.signupForm.get('password')?.value;
    this.passwordLength = password.length >= 6;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);

    // Calculate password strength
    this.passwordStrength =
      (this.passwordLength ? 33 : 0) +
      (this.hasUpperCase ? 33 : 0) +
      (this.hasNumber ? 34 : 0);
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.AuthService.loginUser(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe(
        (response) => {
          this.toastr.success('Login successful!', 'Welcome');
        },
        (error) => {
          this.toastr.error(
            'Login failed. Please check your credentials.',
            'Error'
          );
        }
      );
    } else {
      // Signup mode
      if (this.signupForm.valid) {
        const { username, email, password } = this.signupForm.value;
  
        this.AuthService.createNewUser(username, email, password).subscribe(
          (response) => {
            this.toastr.success('Account created successfully!', 'Welcome');
            // Automatically login the user after successful signup
            this.AuthService.loginUser(username, password).subscribe(
              (loginResponse) => {
                this.toastr.success('You are now logged in!', 'Welcome');
                // Navigation is handled in the AuthService
              },
              (loginError) => {
                this.toastr.error('Auto-login failed. Please log in manually.', 'Error');
              }
            );
          },
          (error) => {
            if (error.field === 'username') {
              this.signupForm.get('username')?.setErrors({ taken: true });
            } else if (error.field === 'email') {
              this.signupForm.get('email')?.setErrors({ taken: true });
            }
            this.toastr.error(error.message, 'Account Creation Failed');
          }
        );
      } else {
        // Form is invalid, show error messages
        Object.keys(this.signupForm.controls).forEach((key) => {
          const control = this.signupForm.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
      }
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
      this.AuthService.forgotPassword(
        this.forgotPasswordForm.value.email
      ).subscribe(
        () => {
          this.toastr.success(
            'Password reset email sent. Please check your inbox.',
            'Success'
          );
          this.isForgotPasswordMode = false;
        },
        (error) => {
          this.toastr.error(
            'Failed to send password reset email. Please try again.',
            'Error'
          );
        }
      );
    }
  }

  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.forgotPasswordForm.reset();
  }
}
