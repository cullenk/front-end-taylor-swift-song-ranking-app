import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

interface PasswordStrength {
  strength: number;
  hasLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Forms
  readonly loginForm: FormGroup;
  readonly signupForm: FormGroup;
  readonly forgotPasswordForm: FormGroup;

  // Component State
  isLoginMode = true;
  isForgotPasswordMode = false;
  showPassword = false;

  // Password Strength
  passwordStrength: PasswordStrength = {
    strength: 0,
    hasLength: false,
    hasUpperCase: false,
    hasNumber: false
  };

  // Album Covers - moved to readonly for better performance
  private readonly albumCovers = [
    'https://d3e29z0m37b0un.cloudfront.net/1989.webp',
    'https://d3e29z0m37b0un.cloudfront.net/evermore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/fearless_taylors_version_album.webp',
    'https://d3e29z0m37b0un.cloudfront.net/folklore.webp',
    'https://d3e29z0m37b0un.cloudfront.net/lover.webp',
    'https://d3e29z0m37b0un.cloudfront.net/midnights.webp',
    'https://d3e29z0m37b0un.cloudfront.net/ttpd1.webp',
    'https://d3e29z0m37b0un.cloudfront.net/red-tv.webp',
    'https://d3e29z0m37b0un.cloudfront.net/reputation.webp',
    'https://d3e29z0m37b0un.cloudfront.net/speak-now-tv.webp',
    'https://d3e29z0m37b0un.cloudfront.net/Taylor+Swift.webp',
    'https://d3e29z0m37b0un.cloudfront.net/life-of-a-showgirl.webp',
  ];

  shuffledColumns: string[][] = [];

  @ViewChild('albumColumns') albumColumnsElement!: ElementRef;
  @ViewChild('randomSquares') randomSquaresElement!: ElementRef;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private meta: Meta,
    private title: Title
  ) {
    this.loginForm = this.createLoginForm();
    this.signupForm = this.createSignupForm();
    this.forgotPasswordForm = this.createForgotPasswordForm();
  }

  ngOnInit(): void {
    this.shuffleAlbumCovers();
    this.updateMetaTags();
  }

  ngAfterViewInit(): void {
    this.generateRandomSquares();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create login form with validators
   */
  private createLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Create signup form with validators
   */
  private createSignupForm(): FormGroup {
    return new FormGroup({
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
  }

  /**
   * Create forgot password form with validators
   */
  private createForgotPasswordForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**
   * Update meta tags for SEO
   */
  private updateMetaTags(): void {
    this.title.setTitle('Sign In - Swiftie Ranking Hub');

    const description = 'Sign in or create an account to join Swiftie Ranking Hub. Rank your favorite Taylor Swift songs and share your profile with other fans!';

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Sign In - Swiftie Ranking Hub' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
    this.meta.updateTag({ property: 'og:url', content: 'https://swiftierankinghub.com/login' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Sign In - Swiftie Ranking Hub' });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://d3e29z0m37b0un.cloudfront.net/graphics/link-preview-image-min.webp' });
  }

  /**
   * Shuffle album covers using Fisher-Yates algorithm
   */
  private shuffleAlbumCovers(): void {
    const shuffled = [...this.albumCovers];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Split into three columns
    const columnSize = Math.ceil(shuffled.length / 3);
    this.shuffledColumns = [
      shuffled.slice(0, columnSize),
      shuffled.slice(columnSize, columnSize * 2),
      shuffled.slice(columnSize * 2),
    ];
  }

  /**
   * Generate random decorative squares
   */
  private generateRandomSquares(): void {
    if (!this.randomSquaresElement?.nativeElement) return;

    const container = this.randomSquaresElement.nativeElement;
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'];
    const numSquares = 15;

    // Clear existing squares
    container.innerHTML = '';

    for (let i = 0; i < numSquares; i++) {
      const square = this.renderer.createElement('div');
      this.renderer.addClass(square, 'random-square');

      const size = Math.floor(Math.random() * 50) + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.renderer.setStyle(square, 'width', `${size}px`);
      this.renderer.setStyle(square, 'height', `${size}px`);
      this.renderer.setStyle(square, 'top', `${Math.random() * 100}%`);
      this.renderer.setStyle(square, 'left', `${Math.random() * 100}%`);
      this.renderer.setStyle(square, 'background-color', color);
      this.renderer.setStyle(square, 'opacity', '0.5');

      this.renderer.appendChild(container, square);
    }
  }

  /**
   * Handle mouse movement for parallax effect
   */
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.albumColumnsElement?.nativeElement) return;

    const columns = this.albumColumnsElement.nativeElement.querySelectorAll('.column');
    const mouseY = event.clientY / window.innerHeight;

    columns.forEach((column: HTMLElement, index: number) => {
      const movement = (index % 2 === 0 ? 1 : -1) * 50 * (mouseY - 0.5);
      this.renderer.setStyle(column, 'transform', `translateY(${movement}px)`);
    });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Calculate password strength on input
   */
  onPasswordInput(): void {
    const password = this.signupForm.get('password')?.value || '';
    
    this.passwordStrength = {
      hasLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      strength: 0
    };

    // Calculate overall strength percentage
    const criteria = [
      this.passwordStrength.hasLength,
      this.passwordStrength.hasUpperCase,
      this.passwordStrength.hasNumber
    ];
    
    this.passwordStrength.strength = (criteria.filter(Boolean).length / criteria.length) * 100;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleSignup();
    }
  }

  /**
   * Handle login form submission
   */
  private handleLogin(): void {
    if (!this.loginForm.valid) return;

    const { username, password } = this.loginForm.value;

    this.authService.loginUser(username, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Login successful!', 'Welcome');
        },
        error: () => {
          this.toastr.error('Login failed. Please check your credentials.', 'Error');
        }
      });
  }

  /**
   * Handle signup form submission
   */
  private handleSignup(): void {
    if (!this.signupForm.valid) {
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    const { username, email, password } = this.signupForm.value;

    this.authService.createNewUser(username, email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Account created successfully!', 'Welcome');
          this.attemptAutoLogin(username, password);
        },
        error: (error) => {
          this.handleSignupError(error);
        }
      });
  }

  /**
   * Attempt automatic login after signup
   */
  private attemptAutoLogin(username: string, password: string): void {
    this.authService.loginUser(username, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('You are now logged in!', 'Welcome');
        },
        error: () => {
          this.toastr.error('Auto-login failed. Please log in manually.', 'Error');
        }
      });
  }

  /**
   * Handle signup errors
   */
  private handleSignupError(error: any): void {
    if (error.field === 'username') {
      this.signupForm.get('username')?.setErrors({ taken: true });
    } else if (error.field === 'email') {
      this.signupForm.get('email')?.setErrors({ taken: true });
    }
    this.toastr.error(error.message || 'Account creation failed', 'Error');
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Toggle between login and signup modes
   */
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.resetForms();
    this.showPassword = false;
  }

  /**
   * Handle forgot password submission
   */
  onForgotPassword(): void {
    if (!this.forgotPasswordForm.valid) return;

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Password reset email sent. Please check your inbox.', 'Success');
          this.isForgotPasswordMode = false;
        },
        error: () => {
          this.toastr.error('Failed to send password reset email. Please try again.', 'Error');
        }
      });
  }

  /**
   * Toggle forgot password mode
   */
  toggleForgotPasswordMode(): void {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.resetForms();
    this.showPassword = false;
  }

  /**
   * Reset all forms
   */
  private resetForms(): void {
    this.loginForm.reset();
    this.signupForm.reset();
    this.forgotPasswordForm.reset();
    this.passwordStrength = { strength: 0, hasLength: false, hasUpperCase: false, hasNumber: false };
  }

  /**
   * Track by function for ngFor performance
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Track by function for covers
   */
  trackByCover(index: number, cover: string): string {
    return cover;
  }
}