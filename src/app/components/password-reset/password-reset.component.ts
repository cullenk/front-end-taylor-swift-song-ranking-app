import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      this.toastr.error('Invalid password reset link');
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      const newPassword = this.resetForm.get('password')?.value;

      // Additional password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        this.toastr.warning(
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
          'Password Requirements',
          { timeOut: 10000, closeButton: true, progressBar: true }
        );
        return;
      }

      this.authService.resetPassword(this.token, newPassword).subscribe(
        () => {
          this.toastr.success('Your password has been reset successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.error && error.error.message) {
            if (error.error.message.includes('Password must be')) {
              this.toastr.warning(error.error.message, 'Password Requirements', {
                timeOut: 10000,
                closeButton: true,
                progressBar: true
              });
            } else {
              this.toastr.error(error.error.message, 'Password Reset Failed');
            }
          } else {
            this.toastr.error('Failed to reset password. Please try again.', 'Error');
          }
        }
      );
    } else {
      // Form is invalid, show error messages
      Object.keys(this.resetForm.controls).forEach(key => {
        const control = this.resetForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}