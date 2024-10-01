import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { AuthLayoutComponent } from '../shared/components/auth-layout/auth-layout.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayoutComponent, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);

  public loginForm!: FormGroup;
  public loading = false;
  public showPassword = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // TODO melhorar tratamento de erro de API
  private errorHandler(error: any) {
    let message = 'An error occurred. Please try again.';

    if (error.message) {
      message = error.message;
    }

    this._snackBar.open(message, 'Close');
  }

  public async onSubmit() {
    try {
      this.loading = true;
      const observer = this.authService.login(this.loginForm.value);
      const { token } = await firstValueFrom(observer);
      console.log(token); // TODO salvar isso num estado superior ou localStore para ser usado em outros services
    } catch (error) {
      this.errorHandler(error);
    } finally {
      this.loading = false;
    }
  }

  public togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
