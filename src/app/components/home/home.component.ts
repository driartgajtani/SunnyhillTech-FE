import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtService } from '../../services/jwt.service';
import { JwtToken } from '../../models/auth/jwt-token';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [RouterModule, MatSidenavModule, MatDialogModule, TranslateModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  /**
   *
   */
  data: JwtToken;
  currentTime: string;
  greetingMessage: string;

  constructor(private router: Router, private dialog: MatDialog, private jwtService: JwtService, private toastr: ToastrService, private profileService: ProfileService, private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('de');
    // Use the current language
    this.translate.use('de');
    this.data = this.jwtService.decodeToken();
    this.profileService.loadProfile(+this.data.Id)
    this.currentTime = this.getCurrentTime(); // Get the current time
    this.getGreetingMessage(this.currentTime, this.data.roles.toString());
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      data: this.profileService.profile$,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.profileService.loadProfile(+this.data.Id)
        this.getGreetingMessage(this.currentTime, this.data.roles.toString());
        this.toastr.success('Updated Successfully')
        // Handle profile update success
      } else if (result === 'error') {
        console.log('Error updating profile');
        // Handle profile update failure
      }
    });
  }

  private getCurrentTime(): string {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'morning';
    } else if (currentHour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  private getGreetingMessage(timeOfDay: string, role: string): string {
    let greeting: string;

    // Adjust greeting based on time of day
    switch (timeOfDay) {
      case 'morning':
        this.translate.get('GoodMorning').subscribe(res => {
          this.greetingMessage = res;
          role.toLowerCase() == 'admin' ? this.greetingMessage += ', Admin! ' + this.data.Name : this.greetingMessage += ', ' +this.data.Name;
        });
        break;
      case 'afternoon':
        this.translate.get('GoodAfternoon').subscribe(res => {
          this.greetingMessage = res;
          role.toLowerCase() == 'admin' ? this.greetingMessage += ', Admin! ' + this.data.Name : this.greetingMessage += ', ' +this.data.Name;
        });
        break
      case 'evening':
        this.translate.get('GoodEvening').subscribe(res => {
          this.greetingMessage = res;
          role.toLowerCase() == 'admin' ? this.greetingMessage += ', Admin! ' + this.data.Name : this.greetingMessage += ', ' +this.data.Name;
        });
        break;

    }

    return greeting;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.getGreetingMessage(this.currentTime, this.data.roles.toString());
}

  logout() {
    this.jwtService.purgeAuth();
    this.router.navigate(['/login']);
  }
}
